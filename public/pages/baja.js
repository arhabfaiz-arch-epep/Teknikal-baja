document.addEventListener('DOMContentLoaded', function() {
    var loginModal = document.getElementById('login-modal');
    var loginForm = document.getElementById('login-form');
    var closeModal = document.querySelector('.close-modal');

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            if (username && password) {
                // Show loading state
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sedang Masuk...';
                submitBtn.disabled = true;

                try {
                    // Use API helper for login
                    const result = await teknikal_baja_api.login(username, password);

                    if (result && result.success) {
                        // Success - redirect to main application
                        TeknikalBajaAPI.showNotification('Login berhasil! Mengalihkan ke dashboard...');

                        // Redirect to main application after a short delay
                        setTimeout(() => {
                            window.location.href = '../index.html';
                        }, 1500);
                    } else {
                        // Login failed
                        TeknikalBajaAPI.showNotification(result?.message || 'Login gagal. Periksa username dan password.', 'error');
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    TeknikalBajaAPI.showNotification('Terjadi kesalahan saat login. Coba lagi.', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } else {
                TeknikalBajaAPI.showNotification('Masukkan username dan password!', 'error');
            }
        });
    }

    // Initialize modal on page load
    if (loginModal) {
        loginModal.style.display = 'flex';
    }
});
