document.addEventListener('DOMContentLoaded', function() {
    // ===== API Configuration =====
    // Auto-detect API base URL (localhost for dev, same domain for production)
    const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : `${window.location.origin}/api`;
    
    let currentUser = null;
    let authToken = null;

    // ===== HALAMAN INDEX (Landing) =====
    var loginModal = document.getElementById('loginModal');
    var loginForm = document.getElementById('loginForm');
    var registerModal = document.getElementById('registerModal');
    var registerForm = document.getElementById('registerForm');
    var loginNavBtn = document.getElementById('loginNavBtn');
    var logoutNavBtn = document.getElementById('logoutNavBtn');
    var closeLoginBtn = document.getElementById('closeLoginBtn');
    var closeRegisterBtn = document.getElementById('closeRegisterBtn');
    var welcomeScreen = document.getElementById('welcomeScreen');
    var sidebar = document.getElementById('sidebar');
    var mainContent = document.getElementById('mainContent');
    var modalOverlay = document.getElementById('modalOverlay');
    var registerModalOverlay = document.getElementById('registerModalOverlay');
    var exploreBtn = document.getElementById('exploreBtn');
    var learnMoreBtn = document.getElementById('learnMoreBtn');
    var showRegisterLink = document.getElementById('showRegisterLink');
    var showLoginLink = document.getElementById('showLoginLink');

    // Helper: Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Helper: Make API calls
    async function apiCall(endpoint, method = 'GET', body = null) {
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(authToken && { 'Authorization': `Bearer ${authToken}` })
                }
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${API_BASE}${endpoint}`, options);
            const data = await response.json();

            if (!response.ok) {
                console.error('API Error Response:', response.status, data);
                return data; // Return the error response with message
            }

            return data;
        } catch (error) {
            console.error('API Fetch Error:', error);
            return {
                success: false,
                message: 'Network error: ' + error.message
            };
        }
    }

    // Open login modal dari navbar
    if (loginNavBtn) {
        loginNavBtn.addEventListener('click', function() {
            if (loginModal) {
                loginModal.style.display = 'flex';
                initLoginModalAnimations();
            }
        });
    }

    // Close login modal
    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', function() {
            if (loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }

    // Close modal when clicking overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            if (loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }

    // Close register modal
    if (closeRegisterBtn) {
        closeRegisterBtn.addEventListener('click', function() {
            if (registerModal) {
                registerModal.style.display = 'none';
            }
        });
    }

    // Close register modal when clicking overlay
    if (registerModalOverlay) {
        registerModalOverlay.addEventListener('click', function() {
            if (registerModal) {
                registerModal.style.display = 'none';
            }
        });
    }

    // Show register modal
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) {
                registerModal.style.display = 'flex';
                initLoginModalAnimations();
            }
        });
    }

    // Show login modal
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (registerModal) registerModal.style.display = 'none';
            if (loginModal) {
                loginModal.style.display = 'flex';
                initLoginModalAnimations();
            }
        });
    }

    // Handle login form submission dengan API
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            if (!username || !password) {
                showNotification('Username dan password harus diisi', 'error');
                return;
            }

            // Disable button saat loading
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Loading...';

            // Call API login
            const result = await apiCall('/auth/login', 'POST', { username, password });

            if (result && result.success) {
                currentUser = result.user;
                authToken = result.token;

                // Simpan ke localStorage
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                showNotification('Login berhasil! 🎉', 'success');

                // Animasi fade out login modal
                anime({
                    targets: loginModal,
                    opacity: [1, 0],
                    duration: 400,
                    easing: 'easeInExpo',
                    complete: function() {
                        if (loginModal) loginModal.style.display = 'none';
                        if (welcomeScreen) welcomeScreen.style.display = 'none';
                        if (sidebar) sidebar.style.display = 'block';
                        if (mainContent) mainContent.style.display = 'flex';

                        // Animasi sidebar slide in
                        anime.timeline()
                            .add({
                                targets: sidebar,
                                translateX: [-280, 0],
                                opacity: [0, 1],
                                duration: 500,
                                easing: 'easeOutExpo'
                            })
                            .add({
                                targets: mainContent,
                                opacity: [0, 1],
                                duration: 500,
                                easing: 'easeOutExpo'
                            }, '-=400');

                        // Tampilkan dashboard section
                        var dashboardSection = document.getElementById('dashboard');
                        if (dashboardSection) {
                            dashboardSection.style.display = 'block';
                            initDashboardAnimations();
                        }

                        // Update navbar buttons
                        if (loginNavBtn) loginNavBtn.style.display = 'none';
                        if (logoutNavBtn) logoutNavBtn.style.display = 'block';

                        loginForm.reset();
                        initMenuLinkAnimations();
                        loadDashboardData();
                    }
                });
            } else {
                const errorMsg = result?.message || 'Login gagal, coba lagi';
                console.log('Login failed:', result);
                showNotification(errorMsg, 'error');
            }

            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Masuk';
        });
    }

    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            var fullname = document.getElementById('reg-fullname').value.trim();
            var username = document.getElementById('reg-username').value.trim();
            var email = document.getElementById('reg-email').value.trim();
            var password = document.getElementById('reg-password').value;
            var passwordConfirm = document.getElementById('reg-password-confirm').value;

            console.log('Registration attempt:', {fullname, username, email, password, passwordConfirm});

            if (!fullname || !username || !email || !password || !passwordConfirm) {
                showNotification('Semua field harus diisi', 'error');
                console.log('Validation failed: empty fields');
                return;
            }

            if (password !== passwordConfirm) {
                showNotification('Password dan konfirmasi password tidak cocok', 'error');
                return;
            }

            if (password.length < 6) {
                showNotification('Password minimal 6 karakter', 'error');
                return;
            }

            // Disable button saat loading
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Loading...';

            // Call API register
            const result = await apiCall('/auth/register', 'POST', { 
                username, 
                email, 
                password, 
                name: fullname
            });

            if (result && result.success) {
                showNotification('Akun berhasil dibuat! Silakan login', 'success');

                // Reset form dan switch ke login modal
                registerForm.reset();
                registerModal.style.display = 'none';
                
                setTimeout(() => {
                    loginModal.style.display = 'flex';
                    initLoginModalAnimations();
                }, 500);
            } else {
                const errorMsg = result?.message || 'Registrasi gagal, coba lagi';
                console.log('Registration failed:', result);
                showNotification(errorMsg, 'error');
            }

            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Daftar';
        });
    }

    // Load dashboard data dari API
    async function loadDashboardData() {
        const steels = await apiCall('/steel/types');
        const standards = await apiCall('/steel/standards');

        if (steels) {
            console.log('Steel data loaded:', steels.count + ' types');
        }
        if (standards) {
            console.log('Standards loaded:', standards.count + ' regions');
        }
    }

    // Helper: Show confirmation dialog
    function showConfirmation(message, onConfirm, onCancel) {
        const confirmDialog = document.createElement('div');
        confirmDialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
        `;

        const dialogContent = document.createElement('div');
        dialogContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 350px;
        `;

        dialogContent.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.1rem;">${message}</h3>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="confirmYes" style="
                    padding: 0.7rem 1.5rem;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                ">Ya, Logout</button>
                <button id="confirmNo" style="
                    padding: 0.7rem 1.5rem;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                ">Batal</button>
            </div>
        `;

        confirmDialog.appendChild(dialogContent);
        document.body.appendChild(confirmDialog);

        document.getElementById('confirmYes').addEventListener('click', () => {
            confirmDialog.remove();
            onConfirm();
        });

        document.getElementById('confirmNo').addEventListener('click', () => {
            confirmDialog.remove();
            if (onCancel) onCancel();
        });

        // Click outside to cancel
        confirmDialog.addEventListener('click', (e) => {
            if (e.target === confirmDialog) {
                confirmDialog.remove();
                if (onCancel) onCancel();
            }
        });
    }

    // Perform logout
    function performLogout() {
        currentUser = null;
        authToken = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');

        if (sidebar) sidebar.style.display = 'none';
        if (mainContent) mainContent.style.display = 'none';
        if (welcomeScreen) welcomeScreen.style.display = 'block';
        if (loginNavBtn) loginNavBtn.style.display = 'block';
        if (logoutNavBtn) logoutNavBtn.style.display = 'none';

        showNotification('Logout berhasil', 'success');
    }

    // Handle logout from navbar
    if (logoutNavBtn) {
        logoutNavBtn.addEventListener('click', function() {
            showConfirmation('Apakah Anda yakin ingin logout?', performLogout);
        });
    }

    // Handle explore button
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            if (loginModal) {
                loginModal.style.display = 'flex';
                initLoginModalAnimations();
            }
        });
    }

    // Handle menu link animations
    function initMenuLinkAnimations() {
        var menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(function(link) {
            link.addEventListener('mouseenter', function() {
                anime({
                    targets: link,
                    translateX: [0, 5],
                    duration: 200,
                    easing: 'easeOutExpo'
                });
            });

            link.addEventListener('mouseleave', function() {
                anime({
                    targets: link,
                    translateX: [5, 0],
                    duration: 200,
                    easing: 'easeOutExpo'
                });
            });

            link.addEventListener('click', function(e) {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    var sectionId = link.getAttribute('href').substring(1);
                    navigateToSection(sectionId);
                }
            });
        });
    }

    // Handle logout button in menu
    var logoutBtnMenu = document.querySelector('.logout-btn');
    if (logoutBtnMenu) {
        logoutBtnMenu.addEventListener('click', function(e) {
            e.preventDefault();
            showConfirmation('Apakah Anda yakin ingin logout?', performLogout);
        });
    }

    // Navigate to section
    function navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.dashboard, .knowledge, .jenis-baja, .standar, .tools, .profil').forEach(function(section) {
            section.style.display = 'none';
        });

        // Show selected section
        var section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
            
            var sectionNames = {
                'dashboard': 'Dashboard',
                'pengetahuan': 'Pengetahuan Teknikal Baja',
                'jenis-baja': 'Jenis-Jenis Baja',
                'standar': 'Standar Baja Internasional',
                'tools': 'Tools Kalkulator Teknis',
                'profil': 'Profil Saya'
            };
            
            var navTitle = document.getElementById('nav-title');
            if (navTitle) {
                navTitle.textContent = sectionNames[sectionId] || 'Dashboard';
            }
            
            // Update active menu
            document.querySelectorAll('.menu-link').forEach(function(link) {
                link.classList.remove('active');
            });
            
            var activeLink = document.querySelector('a[href="#' + sectionId + '"]');
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Animate section in
            anime({
                targets: '#' + sectionId,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 400,
                easing: 'easeOutExpo'
            });
        }
    }

    // Initialize dashboard animations
    function initDashboardAnimations() {
        anime.timeline()
            .add({
                targets: '.welcome-card',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 500,
                easing: 'easeOutExpo'
            })
            .add({
                targets: '.stat-card',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 500,
                easing: 'easeOutExpo',
                stagger: 100
            }, '-=300')
            .add({
                targets: '.feature-item',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 500,
                easing: 'easeOutExpo',
                stagger: 100
            }, '-=300');
    }

    // Initialize badge animations
    function initBadgeAnimations() {
        var badges = document.querySelectorAll('.menu-badge');
        if (badges.length > 0) {
            anime({
                targets: '.menu-badge',
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1],
                duration: 2000,
                easing: 'easeInOutQuad',
                loop: true,
                delay: anime.stagger(200)
            });
        }
    }

    // Initialize card hover animations
    function initCardHoverAnimations() {
        document.querySelectorAll('.stat-card, .feature-item').forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                anime({
                    targets: card,
                    scale: 1.02,
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            });

            card.addEventListener('mouseleave', function() {
                anime({
                    targets: card,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            });
        });
    }

    // Initialize login modal animations
    function initLoginModalAnimations() {
        anime({
            targets: '.modal-content',
            opacity: [0, 1],
            scale: [0.95, 1],
            duration: 500,
            easing: 'easeOutExpo'
        });
    }

    // Check if user already logged in
    function checkAndAutoLogin() {
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('currentUser');
        
        if (savedToken && savedUser) {
            try {
                authToken = savedToken;
                currentUser = JSON.parse(savedUser);
                
                // Auto-login - hide welcome, show dashboard
                if (welcomeScreen) welcomeScreen.style.display = 'none';
                if (sidebar) sidebar.style.display = 'block';
                if (mainContent) mainContent.style.display = 'flex';
                if (loginNavBtn) loginNavBtn.style.display = 'none';
                if (logoutNavBtn) logoutNavBtn.style.display = 'block';

                var dashboardSection = document.getElementById('dashboard');
                if (dashboardSection) {
                    dashboardSection.style.display = 'block';
                    initDashboardAnimations();
                }

                initMenuLinkAnimations();
                loadDashboardData();
                
                console.log('Auto-login successful:', currentUser.username);
                return true;
            } catch (err) {
                console.error('Auto-login error:', err);
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
                return false;
            }
        }
        return false;
    }

    // Run auto-login check on page load
    checkAndAutoLogin();

    // Initialize all animations
    initMenuLinkAnimations();
    initBadgeAnimations();
    initCardHoverAnimations();
    initLoginModalAnimations();
});
