document.addEventListener('DOMContentLoaded', function() {
    var loginModal = document.getElementById('login-modal');
    var sidebar = document.getElementById('sidebar');
    var mainContent = document.getElementById('main-content');
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
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            if (username && password) {
                anime({
                    targets: '#login-modal',
                    opacity: [1, 0],
                    duration: 400,
                    easing: 'easeInExpo',
                    complete: function() {
                        loginModal.style.display = 'none';
                        sidebar.style.display = 'block';
                        mainContent.style.display = 'block';

                        anime.timeline()
                            .add({
                                targets: '#sidebar',
                                translateX: [-280, 0],
                                opacity: [0, 1],
                                duration: 500,
                                easing: 'easeOutExpo'
                            })
                            .add({
                                targets: '#main-content',
                                opacity: [0, 1],
                                duration: 500,
                                easing: 'easeOutExpo'
                            }, '-=400');

                        loginForm.reset();
                        initDashboardAnimations();
                    }
                });
            } else {
                alert('Masukkan username dan password!');
            }
        });
    }

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

    function navigateToSection(sectionId) {
        document.querySelectorAll('.dashboard, .home, .about, .services, .testimonials, .faq, .team, .blog, .contact').forEach(function(section) {
            section.style.display = 'none';
        });

        var section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
            
            var sectionNames = {
                'dashboard': 'Dashboard Teknikal Baja',
                'home': 'Beranda',
                'about': 'Tentang Kami',
                'services': 'Layanan',
                'testimonials': 'Testimonial',
                'faq': 'FAQ',
                'team': 'Tim Kami',
                'blog': 'Blog',
                'contact': 'Hubungi Kami'
            };
            
            document.getElementById('nav-title').textContent = sectionNames[sectionId] || 'Dashboard';
            
            document.querySelectorAll('.menu-link').forEach(function(link) {
                link.classList.remove('active');
            });
            
            var activeLink = document.querySelector('a[href="#' + sectionId + '"]');
            if (activeLink) {
                activeLink.classList.add('active');
            }

            anime({
                targets: '#' + sectionId,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 400,
                easing: 'easeOutExpo'
            });
        }
    }

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

    function initLoginModalAnimations() {
        anime({
            targets: '.modal-content',
            opacity: [0, 1],
            scale: [0.95, 1],
            duration: 500,
            easing: 'easeOutExpo'
        });
    }

    function initFAQToggle() {
        var faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(function(question) {
            question.addEventListener('click', function() {
                var faqItem = this.parentElement;
                var isActive = faqItem.classList.contains('active');

                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(function(item) {
                    item.classList.remove('active');
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }

    initMenuLinkAnimations();
    initBadgeAnimations();
    initCardHoverAnimations();
    initLoginModalAnimations();
    initFAQToggle();
});
