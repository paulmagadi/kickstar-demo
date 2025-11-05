// Login Page Management
class LoginPage {
    constructor() {
        this.form = document.getElementById('login-form');
        this.emailInput = document.getElementById('login-email');
        this.passwordInput = document.getElementById('login-password');
        this.submitBtn = document.getElementById('login-submit-btn');
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordToggle();
        this.setupDemoCredentials();
        this.checkRememberedUser();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        
        this.emailInput.addEventListener('input', () => this.clearError('login-email'));
        this.passwordInput.addEventListener('input', () => this.clearError('login-password'));

        // Success modal buttons
        document.getElementById('go-to-account-login').addEventListener('click', () => {
            window.location.href = 'account.html';
        });

        document.getElementById('continue-shopping-login').addEventListener('click', () => {
            window.location.href = '../index.html';
        });

        // Social login buttons (demo functionality)
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialLogin(btn.classList.contains('google') ? 'google' : 'facebook');
            });
        });
    }

    setupPasswordToggle() {
        const togglePassword = document.getElementById('login-toggle-password');

        togglePassword.addEventListener('click', () => {
            this.togglePasswordVisibility(this.passwordInput, togglePassword);
        });
    }

    setupDemoCredentials() {
        document.querySelectorAll('.copy-credential').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const value = btn.dataset.value;
                this.copyToClipboard(value);
                
                // Show feedback
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="ri-check-line"></i> Copied!';
                btn.style.color = 'var(--success)';
                
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.style.color = '';
                }, 2000);
            });
        });

        // Auto-fill demo credentials on click
        document.querySelector('.demo-credentials').addEventListener('click', (e) => {
            if (e.target.classList.contains('credential-item') || e.target.closest('.credential-item')) {
                this.emailInput.value = 'demo@kickstar.com';
                this.passwordInput.value = 'Demo123!';
                this.clearError('login-email');
                this.clearError('login-password');
            }
        });
    }

    togglePasswordVisibility(input, button) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = button.querySelector('i');
        icon.className = isPassword ? 'ri-eye-off-line' : 'ri-eye-line';
        
        button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        // Validate fields
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            this.showFirstError();
            return;
        }

        await this.authenticateUser();
    }

    validateEmail() {
        const value = this.emailInput.value.trim();
        const errorElement = document.getElementById('login-email-error');

        if (!value) {
            this.showError('login-email', 'Email address is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.showError('login-email', 'Please enter a valid email address');
            return false;
        }

        this.showSuccess('login-email');
        return true;
    }

    validatePassword() {
        const value = this.passwordInput.value;
        const errorElement = document.getElementById('login-password-error');

        if (!value) {
            this.showError('login-password', 'Password is required');
            return false;
        }

        this.showSuccess('login-password');
        return true;
    }

    async authenticateUser() {
        this.isSubmitting = true;
        this.submitBtn.disabled = true;
        this.submitBtn.classList.add('loading');
        this.submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Signing In...';

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const email = this.emailInput.value.trim();
            const password = this.passwordInput.value;
            const rememberMe = document.getElementById('remember-me').checked;

            // Authenticate user
            const user = await this.verifyCredentials(email, password);

            if (user) {
                // Save user session
                this.saveUserSession(user, rememberMe);
                
                // Show success
                this.showSuccessModal();
            } else {
                throw new Error('Invalid credentials');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.handleLoginError(error.message);
        } finally {
            this.isSubmitting = false;
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
            this.submitBtn.innerHTML = '<i class="ri-login-box-line"></i> Sign In';
        }
    }

    async verifyCredentials(email, password) {
        // In a real app, this would be an API call to your backend
        // For demo, we'll check against localStorage
        
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Demo user check
            if (email === 'demo@kickstar.com' && password === 'Demo123!') {
                return this.createDemoUser();
            }

            // Regular user check
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (user) {
                // In a real app, you'd use proper password hashing and verification
                const hashedPassword = this.hashPassword(password);
                if (user.password === hashedPassword) {
                    return user;
                }
            }

            return null;
        } catch (error) {
            console.error('Error verifying credentials:', error);
            return null;
        }
    }

    createDemoUser() {
        return {
            id: 'USER_DEMO',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@kickstar.com',
            phone: '+254700000000',
            preferences: {
                newsletter: true,
                marketingEmails: true,
                orderUpdates: true,
                smsNotifications: false
            },
            memberSince: new Date().getFullYear(),
            createdAt: new Date().toISOString(),
            isDemo: true
        };
    }

    hashPassword(password) {
        // Same hashing function as registration
        return btoa(password).split('').reverse().join('');
    }

    saveUserSession(user, rememberMe) {
        // Set current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userProfile', JSON.stringify(user));
        
        // Set login timestamp
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        // Remember me functionality
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', user.email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        // Set authentication flag
        localStorage.setItem('isAuthenticated', 'true');
        
        // Dispatch event for other components
        window.dispatchEvent(new Event('userLoggedIn'));
    }

    checkRememberedUser() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            this.emailInput.value = rememberedEmail;
            document.getElementById('remember-me').checked = true;
        }
    }

    handleLoginError(errorMessage) {
        const message = errorMessage === 'Invalid credentials' 
            ? 'Invalid email or password. Please try again.'
            : 'Login failed. Please try again.';

        this.showError('login-email', '');
        this.showError('login-password', message);
        
        // Shake animation for error
        this.form.classList.add('error-shake');
        setTimeout(() => {
            this.form.classList.remove('error-shake');
        }, 500);
    }

    handleSocialLogin(provider) {
        // Demo functionality for social login
        this.showNotification(`Social login with ${provider} would be implemented here.`, 'info');
        
        // In a real app, you would:
        // 1. Redirect to OAuth provider
        // 2. Handle the callback
        // 3. Create/authenticate user
    }

    showSuccessModal() {
        const modal = document.getElementById('login-success-modal');
        modal.style.display = 'flex';

        const modalContent = modal.querySelector('.modal-content');
        modalContent.classList.add('animate-in');

        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('go-to-account-login').focus();

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeSuccessModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeSuccessModal();
            }
        });
    }

    closeSuccessModal() {
        const modal = document.getElementById('login-success-modal');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        field.classList.add('error');
        field.classList.remove('success');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }

        field.setAttribute('aria-invalid', 'true');
        if (errorElement) {
            field.setAttribute('aria-describedby', `${fieldId}-error`);
        }
    }

    showSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        field.classList.remove('error');
        field.classList.add('success');
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }

        field.setAttribute('aria-invalid', 'false');
    }

    clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        field.classList.remove('error');
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    showFirstError() {
        const firstErrorField = this.form.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            firstErrorField.focus();
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="ri-${type === 'success' ? 'check' : 'error-warning'}-line"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 
                         type === 'error' ? 'var(--warning)' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Add shake animation to CSS
const loginStyles = document.createElement('style');
loginStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .error-shake {
        animation: shake 0.5s ease-in-out;
    }
    
    .social-btn {
        position: relative;
        overflow: hidden;
    }
    
    .social-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }
    
    .social-btn:hover::before {
        left: 100%;
    }
`;
document.head.appendChild(loginStyles);

// Initialize login page
document.addEventListener('DOMContentLoaded', () => {
    window.loginPage = new LoginPage();
});