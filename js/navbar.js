const accountEl = document.querySelector('.account i');
const accountDropdownEl = document.querySelector('.account-dropdown');

accountEl.addEventListener('click', () => {
    accountDropdownEl.style.display = 'block';
});