document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const loadingSpinner = loginBtn.querySelector('.loading-spinner');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Toggle password visibility
    window.togglePassword = function() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.querySelector('.toggle-password i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleBtn.className = 'fas fa-eye';
        }
    };

    // Show/hide messages
    function showMessage(element, message, isError = false) {
        element.textContent = message;
        element.style.display = 'block';
        
        if (isError) {
            element.className = 'error-message';
        } else {
            element.className = 'success-message';
        }
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }

    // Set loading state
    function setLoadingState(isLoading) {
        if (isLoading) {
            btnText.style.display = 'none';
            loadingSpinner.style.display = 'flex';
            loginBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            loadingSpinner.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Basic validation
        if (!email || !password) {
            showMessage(errorMessage, 'Please fill in all fields', true);
            return;
        }

        if (!isValidEmail(email)) {
            showMessage(errorMessage, 'Please enter a valid email address', true);
            return;
        }

        // Hide any existing messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Set loading state
        setLoadingState(true);

        try {
            const response = await fetch('/api/kling/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                showMessage(successMessage, 'Login successful! Redirecting...', false);
                
                // Store login data if remember is checked
                if (remember) {
                    localStorage.setItem('kling_email', email);
                } else {
                    localStorage.removeItem('kling_email');
                }

                // Redirect to dashboard after successful login
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                showMessage(errorMessage, data.error || 'Login failed. Please try again.', true);
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage(errorMessage, 'Network error. Please check your connection and try again.', true);
        } finally {
            setLoadingState(false);
        }
    });

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Auto-fill email if saved
    const savedEmail = localStorage.getItem('kling_email');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('remember').checked = true;
    }

    // Add input focus effects
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !loginBtn.disabled) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

    // Add form validation on input
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    emailInput.addEventListener('input', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.style.borderColor = '#e53e3e';
        } else {
            this.style.borderColor = '#e1e5e9';
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.length < 6) {
            this.style.borderColor = '#e53e3e';
        } else {
            this.style.borderColor = '#e1e5e9';
        }
    });

    // Add smooth animations for form elements
    const formElements = document.querySelectorAll('.form-group, .form-options, .login-btn');
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}); 