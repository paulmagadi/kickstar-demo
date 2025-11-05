// Registration Page Management
class RegistrationPage {
    constructor() {
        this.form = document.getElementById('register-form');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirm-password');
        this.submitBtn = document.getElementById('submit-btn');
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordToggle();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        this.setupRealTimeValidation();

        // Password strength checking
        this.passwordInput.addEventListener('input', () => {
            this.checkPasswordStrength();
            this.validatePasswordMatch();
        });

        this.confirmPasswordInput.addEventListener('input', () => {
            this.validatePasswordMatch();
        });

        // Success modal buttons
        document.getElementById('go-to-account').addEventListener('click', () => {
            window.location.href = 'account.html';
        });

        document.getElementById('continue-shopping').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    setupPasswordToggle() {
        const togglePassword = document.getElementById('toggle-password');
        const toggleConfirmPassword = document.getElementById('toggle-confirm-password');

        togglePassword.addEventListener('click', () => {
            this.togglePasswordVisibility(this.passwordInput, togglePassword);
        });

        toggleConfirmPassword.addEventListener('click', () => {
            this.togglePasswordVisibility(this.confirmPasswordInput, toggleConfirmPassword);
        });
    }

    togglePasswordVisibility(input, button) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = button.querySelector('i');
        icon.className = isPassword ? 'ri-eye-off-line' : 'ri-eye-line';
        
        // Update accessibility
        button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    }

    setupRealTimeValidation() {
        const fields = [
            { id: 'first-name', validator: this.validateName.bind(this) },
            { id: 'last-name', validator: this.validateName.bind(this) },
            { id: 'email', validator: this.validateEmail.bind(this) },
            { id: 'phone', validator: this.validatePhone.bind(this) },
            { id: 'password', validator: this.validatePassword.bind(this) },
            { id: 'confirm-password', validator: this.validateConfirmPassword.bind(this) },
            { id: 'terms', validator: this.validateTerms.bind(this) }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                element.addEventListener('blur', () => field.validator());
                element.addEventListener('input', () => this.clearError(field.id));
            }
        });

        // Terms checkbox validation
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => this.validateTerms());
        }
    }

    handleSubmit() {
        if (this.isSubmitting) return;

        // Validate all fields
        const isValid = this.validateAllFields();

        if (isValid) {
            this.submitForm();
        } else {
            this.showFirstError();
        }
    }

    validateAllFields() {
        const validations = [
            this.validateName('first-name'),
            this.validateName('last-name'),
            this.validateEmail(),
            this.validatePhone(),
            this.validatePassword(),
            this.validateConfirmPassword(),
            this.validateTerms()
        ];

        return validations.every(validation => validation);
    }

    validateName(fieldId) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldId}-error`);

        if (!value) {
            this.showError(fieldId, 'This field is required');
            return false;
        }

        if (value.length < 2) {
            this.showError(fieldId, 'Name must be at least 2 characters long');
            return false;
        }

        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            this.showError(fieldId, 'Name can only contain letters, spaces, hyphens, and apostrophes');
            return false;
        }

        this.showSuccess(fieldId);
        return true;
    }

    validateEmail() {
        const field = document.getElementById('email');
        const value = field.value.trim();
        const errorElement = document.getElementById('email-error');

        if (!value) {
            this.showError('email', 'Email address is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }

        // Check if email already exists (in a real app, this would be an API call)
        if (this.checkEmailExists(value)) {
            this.showError('email', 'An account with this email already exists');
            return false;
        }

        this.showSuccess('email');
        return true;
    }

    validatePhone() {
        const field = document.getElementById('phone');
        const value = field.value.trim();
        const errorElement = document.getElementById('phone-error');

        // Phone is optional, so if empty, it's valid
        if (!value) {
            this.clearError('phone');
            return true;
        }

        // Basic phone validation for Kenya
        const phoneRegex = /^\+?254\s?\d{9}$|^0\s?\d{9}$/;
        const cleanedPhone = value.replace(/\s/g, '');

        if (!phoneRegex.test(cleanedPhone)) {
            this.showError('phone', 'Please enter a valid Kenyan phone number');
            return false;
        }

        this.showSuccess('phone');
        return true;
    }

    validatePassword() {
        const field = document.getElementById('password');
        const value = field.value;
        const errorElement = document.getElementById('password-error');

        if (!value) {
            this.showError('password', 'Password is required');
            return false;
        }

        if (value.length < 8) {
            this.showError('password', 'Password must be at least 8 characters long');
            return false;
        }

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            this.showError('password', 'Password must include uppercase, lowercase, number, and special character');
            return false;
        }

        this.showSuccess('password');
        return true;
    }

    validateConfirmPassword() {
        const field = document.getElementById('confirm-password');
        const password = this.passwordInput.value;
        const confirmPassword = field.value;
        const errorElement = document.getElementById('confirm-password-error');

        if (!confirmPassword) {
            this.showError('confirm-password', 'Please confirm your password');
            return false;
        }

        if (password !== confirmPassword) {
            this.showError('confirm-password', 'Passwords do not match');
            return false;
        }

        this.showSuccess('confirm-password');
        return true;
    }

    validateTerms() {
        const field = document.getElementById('terms');
        const errorElement = document.getElementById('terms-error');

        if (!field.checked) {
            this.showError('terms', 'You must agree to the terms and conditions');
            return false;
        }

        this.clearError('terms');
        return true;
    }

    checkPasswordStrength() {
        const password = this.passwordInput.value;
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        const container = this.passwordInput.parentElement.parentElement;

        if (!password) {
            container.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
            strengthText.textContent = 'Weak';
            return;
        }

        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

        // Update UI
        container.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
        
        if (strength <= 3) {
            container.classList.add('strength-weak');
            strengthText.textContent = 'Weak';
        } else if (strength <= 5) {
            container.classList.add('strength-medium');
            strengthText.textContent = 'Medium';
        } else {
            container.classList.add('strength-strong');
            strengthText.textContent = 'Strong';
        }
    }

    validatePasswordMatch() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        if (confirmPassword && password !== confirmPassword) {
            this.showError('confirm-password', 'Passwords do not match');
        } else if (confirmPassword && password === confirmPassword) {
            this.showSuccess('confirm-password');
        }
    }

    checkEmailExists(email) {
        // In a real application, this would be an API call to check if email exists
        // For demo purposes, we'll check localStorage
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            return users.some(user => user.email.toLowerCase() === email.toLowerCase());
        } catch (error) {
            console.error('Error checking email existence:', error);
            return false;
        }
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        field.classList.add('error');
        field.classList.remove('success');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Update aria-invalid for accessibility
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

        // Update aria-invalid for accessibility
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
        // Find the first error and scroll to it
        const firstErrorField = this.form.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            firstErrorField.focus();
        }
    }

    async submitForm() {
        if (this.isSubmitting) return;

        this.isSubmitting = true;
        this.submitBtn.disabled = true;
        this.submitBtn.classList.add('loading');
        this.submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Creating Account...';

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            const formData = new FormData(this.form);
            const userData = {
                id: 'USER' + Date.now(),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone') || '',
                password: this.hashPassword(formData.get('password')), // In real app, hash properly
                preferences: {
                    newsletter: formData.get('newsletter') === 'on',
                    marketingEmails: true,
                    orderUpdates: true,
                    smsNotifications: false
                },
                memberSince: new Date().getFullYear(),
                createdAt: new Date().toISOString()
            };

            // Save user to localStorage (in real app, this would be an API call)
            this.saveUser(userData);

            // Set as current user
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('userProfile', JSON.stringify(userData));

            // Show success modal
            this.showSuccessModal();

        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification('Registration failed. Please try again.', 'error');
        } finally {
            this.isSubmitting = false;
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
            this.submitBtn.innerHTML = '<i class="ri-user-add-line"></i> Create Account';
        }
    }

    hashPassword(password) {
        // In a real application, you should use a proper hashing library
        // This is just a simple demo implementation
        return btoa(password).split('').reverse().join('');
    }

    saveUser(userData) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
        } catch (error) {
            console.error('Error saving user:', error);
            // Create new users array if there's an error
            localStorage.setItem('users', JSON.stringify([userData]));
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        modal.style.display = 'flex';

        // Add animation class
        const modalContent = modal.querySelector('.modal-content');
        modalContent.classList.add('animate-in');

        // Focus management for accessibility
        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('go-to-account').focus();

        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeSuccessModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeSuccessModal();
            }
        });
    }

    closeSuccessModal() {
        const modal = document.getElementById('success-modal');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }

    showNotification(message, type = 'info') {
        // Create notification element
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

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--warning)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Remove after 5 seconds
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

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize registration page
document.addEventListener('DOMContentLoaded', () => {
    window.registrationPage = new RegistrationPage();
});