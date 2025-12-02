document.addEventListener('DOMContentLoaded', function() {
    // ===== HALAMAN INDEX (Landing) =====
    var loginModal = document.getElementById('loginModal');
    var loginForm = document.getElementById('loginForm');
    var loginNavBtn = document.getElementById('loginNavBtn');
    var logoutNavBtn = document.getElementById('logoutNavBtn');
    var closeLoginBtn = document.getElementById('closeLoginBtn');
    var welcomeScreen = document.getElementById('welcomeScreen');
    var sidebar = document.getElementById('sidebar');
    var mainContent = document.getElementById('mainContent');
    var modalOverlay = document.getElementById('modalOverlay');
    var exploreBtn = document.getElementById('exploreBtn');
    var learnMoreBtn = document.getElementById('learnMoreBtn');

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

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            if (username && password) {
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
                    }
                });
            } else {
                alert('Masukkan username dan password!');
            }
        });
    }

    // Handle logout
    if (logoutNavBtn) {
        logoutNavBtn.addEventListener('click', function() {
            if (sidebar) sidebar.style.display = 'none';
            if (mainContent) mainContent.style.display = 'none';
            if (welcomeScreen) welcomeScreen.style.display = 'block';
            if (loginNavBtn) loginNavBtn.style.display = 'block';
            if (logoutNavBtn) logoutNavBtn.style.display = 'none';
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
            if (sidebar) sidebar.style.display = 'none';
            if (mainContent) mainContent.style.display = 'none';
            if (welcomeScreen) welcomeScreen.style.display = 'block';
            if (loginNavBtn) loginNavBtn.style.display = 'block';
            if (logoutNavBtn) logoutNavBtn.style.display = 'none';
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

    // Initialize all animations
    initMenuLinkAnimations();
    initBadgeAnimations();
    initCardHoverAnimations();
    initLoginModalAnimations();
});
