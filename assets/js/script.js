/* ============================================
   Portfolio - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initPlaceholderLinks();
    initNavbar();
    initTypingEffect();
    initCounterAnimation();
    initProjectFilters();
    initCertificateButtons();
    initContactForm();
    initBackToTop();
    initSmoothScroll();
    initAOS();
    initTiltEffect();
    initTawkChat();
    setFooterYear();
});

/* ============================================
   THEME TOGGLE (Light / Dark Mode)
   ============================================ */

function initThemeToggle() {
    const toggleBtn = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // Always start in light theme on each page load.
    html.setAttribute('data-theme', 'light');
    updateThemeIcon('light', themeIcon);
    localStorage.removeItem('portfolio-theme');

    toggleBtn.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
    });
}

function updateThemeIcon(theme, iconElement) {
    if (theme === 'dark') {
        iconElement.className = 'bi bi-sun-fill';
    } else {
        iconElement.className = 'bi bi-moon-stars-fill';
    }
}

/* ============================================
   PLACEHOLDER LINK GUARD
   ============================================ */

function initPlaceholderLinks() {
    const placeholderSelectors = [
        'a[href="#"]',
        'a[href="https://linkedin.com"]',
        'a[href="https://github.com"]',
        'a[href="https://twitter.com"]'
    ].join(', ');

    const placeholderLinks = document.querySelectorAll(placeholderSelectors);

    // IDs of elements that should NOT be treated as placeholders
    const excludedIds = ['modal-cert-pdf-link', 'modal-cert-pdf-download'];

    placeholderLinks.forEach((link) => {
        // Skip certificate modal links
        if (excludedIds.includes(link.id)) return;

        link.setAttribute('aria-disabled', 'true');
        link.classList.add('is-placeholder-link');

        if (!link.hasAttribute('data-placeholder-note')) {
            link.setAttribute('title', 'Bu bağlantı henüz eklenmedi');
            link.setAttribute('data-placeholder-note', 'true');
        }

        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });
}

/* ============================================
   NAVBAR
   ============================================ */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const desktopNavLinks = document.querySelectorAll('.nav-links-wrapper .nav-link');
    const mobileNavItems = document.querySelectorAll('.mob-nav-item');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        desktopNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        mobileNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

/* ============================================
   TYPING EFFECT
   ============================================ */

function initTypingEffect() {
    const typingElement = document.getElementById('hero-typing');
    const words = [
        'Full Stack Geliştirici Hedefinde',
        'Web Developer\'ım',
        'Bilgisayar Programcısı',
        'Kendini Geliştiren'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    animateCounter(counter, target);
                });
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 1500;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}


/* ============================================
   PROJECT FILTERS
   ============================================ */

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ============================================
   CONTACT FORM
   ============================================ */

function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit-contact');

    if (!form || !submitBtn) return;

    const submitBtnText = submitBtn.querySelector('.btn-text');
    const submitBtnIcon = submitBtn.querySelector('i');
    const originalText = submitBtnText ? submitBtnText.textContent : 'Mesaj Gönder';
    const originalIconClass = submitBtnIcon ? submitBtnIcon.className : 'bi bi-send-fill';

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');

        if (submitBtnText) {
            submitBtnText.textContent = 'Gönderiliyor...';
        }

        if (submitBtnIcon) {
            submitBtnIcon.className = 'bi bi-arrow-repeat spin';
        }

        // Simulate sending (replace with actual backend logic)
        setTimeout(() => {
            submitBtn.classList.remove('is-loading');
            submitBtn.classList.add('is-success');

            if (submitBtnText) {
                submitBtnText.textContent = 'Gönderildi!';
            }

            if (submitBtnIcon) {
                submitBtnIcon.className = 'bi bi-check-circle-fill';
            }

            // Reset form
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.classList.remove('is-success');

                if (submitBtnText) {
                    submitBtnText.textContent = originalText;
                }

                if (submitBtnIcon) {
                    submitBtnIcon.className = originalIconClass;
                }
            }, 3000);
        }, 1500);
    });
}

/* ============================================
   CERTIFICATE BUTTONS
   ============================================ */

function initCertificateButtons() {
    const certButtons = document.querySelectorAll('.btn-cert-view');

    certButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-cert-title');
            const issuer = btn.getAttribute('data-cert-issuer');
            const date = btn.getAttribute('data-cert-date');
            const pdfUrl = btn.getAttribute('data-cert-pdf');

            if (title && issuer && date) {
                openCertificateModal(title, issuer, date, pdfUrl);
            }
        });
    });
}

/* ============================================
   CERTIFICATE MODAL
   ============================================ */

function openCertificateModal(title, issuer, date, pdfUrl) {
    const modalEl = document.getElementById('certificateModal');
    const modalTitle = document.getElementById('certificateModalLabel');
    const issuerText = document.getElementById('modal-cert-issuer-text');
    const dateText = document.getElementById('modal-cert-date-text');
    const pdfPreviewWrapper = document.getElementById('cert-pdf-preview-wrapper');
    const pdfIframe = document.getElementById('cert-pdf-iframe');
    const noPdfWrapper = document.getElementById('cert-no-pdf-wrapper');
    const downloadBtn = document.getElementById('modal-cert-download-btn');
    const newTabBtn = document.getElementById('modal-cert-newtab-btn');

    if (!modalEl || typeof bootstrap === 'undefined') return;

    // Başlık ve bilgileri güncelle
    if (modalTitle) modalTitle.textContent = title;
    if (issuerText) issuerText.textContent = issuer;
    if (dateText) dateText.textContent = date;

    const hasPdf = pdfUrl && pdfUrl.trim().length > 0 && pdfUrl !== '#';

    if (hasPdf) {
        // PDF ön izleme göster
        if (pdfPreviewWrapper) {
            pdfPreviewWrapper.classList.remove('d-none');
        }
        if (pdfIframe) {
            pdfIframe.src = pdfUrl;
        }
        if (noPdfWrapper) {
            noPdfWrapper.classList.add('d-none');
        }

        // İndir butonu — Ctrl+P tarzı yazdır/kaydet diyaloğu
        if (downloadBtn) {
            const newDownloadBtn = downloadBtn.cloneNode(true);
            downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);
            newDownloadBtn.classList.remove('d-none');
            newDownloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    if (pdfIframe && pdfIframe.contentWindow) {
                        pdfIframe.contentWindow.focus();
                        pdfIframe.contentWindow.print();
                    }
                } catch (err) {
                    // Cross-origin durumunda yeni sekmede aç ve print tetikle
                    const printWindow = window.open(pdfUrl, '_blank');
                    if (printWindow) {
                        printWindow.addEventListener('load', () => {
                            printWindow.print();
                        });
                    }
                }
            });
        }

        // Yeni sekmede aç butonu
        if (newTabBtn) {
            const newNewTabBtn = newTabBtn.cloneNode(true);
            newTabBtn.parentNode.replaceChild(newNewTabBtn, newTabBtn);
            newNewTabBtn.classList.remove('d-none');
            newNewTabBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(pdfUrl, '_blank');
            });
        }
    } else {
        // PDF yok durumu
        if (pdfPreviewWrapper) {
            pdfPreviewWrapper.classList.add('d-none');
        }
        if (pdfIframe) {
            pdfIframe.src = '';
        }
        if (noPdfWrapper) {
            noPdfWrapper.classList.remove('d-none');
        }
        if (downloadBtn) {
            downloadBtn.classList.add('d-none');
        }
        if (newTabBtn) {
            newTabBtn.classList.add('d-none');
        }
    }

    // Modal kapanınca iframe'i temizle (performans için)
    modalEl.addEventListener('hidden.bs.modal', () => {
        if (pdfIframe) {
            pdfIframe.src = '';
        }
    }, { once: true });

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */

function initBackToTop() {
    const btn = document.getElementById('btn-back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (!targetId || targetId === '#') {
                return;
            }

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.getElementById('main-header').offsetHeight || 90;
                const offset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight + offset;

                window.scrollTo({
                     top: offsetPosition,
                     behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   AOS (Animate on Scroll) Init
   ============================================ */

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            disable: 'mobile'
        });
    }
}

/* ============================================
   TAWK.TO CANLI SOHBET (Mobil nav entegrasyonu)
   ============================================ */

function initTawkChat() {
    const chatBtn = document.getElementById('mob-nav-chat');
    const badge = document.getElementById('mob-nav-chat-badge');
    const mobileMq = window.matchMedia('(max-width: 991.98px)');

    // Tawk global nesnesi Tawk betiğinden önce hazır olabilsin diye garanti altına al
    window.Tawk_API = window.Tawk_API || {};

    // Sohbet PENCERESİ (maximized) açık mı? Baloncuk durumu bununla belirlenir.
    let chatOpen = false;

    // Tawk kök sarmalayıcısı: <body> altında, class'sız, id'li ve içinde iframe
    // barındıran tek div. (Sertifika modalı class'lı olduğu için elenir.)
    // NOT: position kontrolü yok — Tawk konumu iframe'den sonra kurduğu için
    // beklersek baloncuk bir an görünebilir; erken yakalayıp flash'ı önlüyoruz.
    function tawkWrapper() {
        return [...document.body.children].find((el) =>
            el.tagName === 'DIV' &&
            !el.className &&
            el.id &&
            el.querySelector('iframe')
        ) || null;
    }

    // Tawk baloncuğu tekrar göstermeye çalışırsa (stil değişimi) anında geri al.
    let styleObserverAttached = false;
    const styleObserver = new MutationObserver(() => enforce());

    // Sarmalayıcı DOM'a eklendiğinde stil observer'ını bir kez bağla.
    function ensureAttached() {
        const wrap = tawkWrapper();
        if (wrap && !styleObserverAttached) {
            styleObserver.observe(wrap, { attributes: true, attributeFilter: ['style'] });
            styleObserverAttached = true;
        }
        return wrap;
    }

    // Mobilde ve sohbet penceresi kapalıyken Tawk arayüzünü (baloncuk dahil)
    // gizli tut; aksi halde Tawk'ın kendi görünürlüğüne dokunma.
    function enforce() {
        const wrap = ensureAttached();
        if (!wrap) return;
        const shouldHide = mobileMq.matches && !chatOpen;
        const isHidden = wrap.style.getPropertyValue('display') === 'none';
        if (shouldHide) {
            if (!isHidden) wrap.style.setProperty('display', 'none', 'important');
        } else {
            if (isHidden) wrap.style.setProperty('display', 'block', 'important');
        }
    }

    // FLASH ÖNLEME: Tawk sarmalayıcıyı <body>'ye ekleyip iframe'ini hemen ardından
    // koyar. subtree izlemesiyle iframe eklenir eklenmez (mikro-görev hızında)
    // gizleriz; böylece baloncuk hiç görünmez. :has() desteğinden bağımsızdır.
    const bodyObserver = new MutationObserver(() => {
        enforce();
        if (styleObserverAttached) bodyObserver.disconnect();
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Observer'ı kaçıran uç durumlar için kısa yoklama yedeği.
    let pollCount = 0;
    const pollTimer = setInterval(() => {
        enforce();
        if (styleObserverAttached || ++pollCount > 100) clearInterval(pollTimer);
    }, 100);

    // Tawk tam yüklendiğinde de uygula
    window.Tawk_API.onLoad = function () {
        enforce();
    };

    // Sohbet penceresi durumunu takip et
    window.Tawk_API.onChatMaximized = function () {
        chatOpen = true;
        enforce();
    };
    window.Tawk_API.onChatMinimized = function () {
        chatOpen = false;
        enforce();
    };
    window.Tawk_API.onChatHidden = function () {
        chatOpen = false;
        enforce();
    };

    // Okunmamış mesaj sayısını nav ikonundaki rozete yansıt
    window.Tawk_API.onUnreadCountChanged = function (count) {
        if (!badge) return;
        const n = Number(count) || 0;
        if (n > 0) {
            badge.textContent = n > 9 ? '9+' : String(n);
            badge.hidden = false;
        } else {
            badge.hidden = true;
        }
    };

    // Nav ikonuna tıklayınca sohbeti aç/kapat
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            const api = window.Tawk_API;
            if (!api) return;
            if (chatOpen) {
                if (typeof api.minimize === 'function') api.minimize();
            } else {
                chatOpen = true; // observer'ın pencereyi engellememesi için önce izin ver
                enforce();
                if (typeof api.maximize === 'function') api.maximize();
            }
        });
    }

    // Ekran boyutu değişiminde durumu güncelle
    if (typeof mobileMq.addEventListener === 'function') {
        mobileMq.addEventListener('change', enforce);
    } else if (typeof mobileMq.addListener === 'function') {
        mobileMq.addListener(enforce);
    }
}

/* ============================================
   FOOTER YEAR
   ============================================ */

function setFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* ============================================
   3D TILT EFFECT (Hero Section)
   ============================================ */

function initTiltEffect() {
    const heroSection = document.querySelector('.hero-section');
    const codeWindow = document.querySelector('.code-window');
    const heroContent = document.querySelector('.hero-content');

    if (!heroSection || !codeWindow || !heroContent) return;
    if (window.matchMedia("(max-width: 991px)").matches) return;

    heroContent.style.transformStyle = 'preserve-3d';
    const maxRotation = 15;

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;

        const centerY = height / 2;
        const percentY = (y - centerY) / centerY;

        const topBound = height * 0.15;
        const bottomBound = height * 0.85;
        const leftZoneEnd = width * 0.45;
        const rightZoneStart = width * 0.55;

        let isLeftActive = false;
        let isRightActive = false;

        if (y > topBound && y < bottomBound) {
            if (x < leftZoneEnd) {
                isLeftActive = true;
            } else if (x > rightZoneStart) {
                isRightActive = true;
            }
        }

        if (isLeftActive) {
            const leftCenterX = leftZoneEnd / 2;
            const percentX = (x - leftCenterX) / leftCenterX;
            const rotateX = -percentY * maxRotation;
            const rotateY = percentX * maxRotation;

            heroContent.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            heroContent.style.transition = 'transform 0.1s ease-out';
            heroContent.classList.add('is-tilted');
        } else {
            if (heroContent.classList.contains('is-tilted')) {
                heroContent.style.transform = '';
                heroContent.style.transition = 'transform 0.5s ease-out';
                heroContent.classList.remove('is-tilted');
            }
        }

        if (isRightActive) {
            const rightCenterX = rightZoneStart + ((width - rightZoneStart) / 2);
            const percentX = (x - rightCenterX) / ((width - rightZoneStart) / 2);
            const rotateX = -percentY * maxRotation;
            const rotateY = percentX * maxRotation;

            codeWindow.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            codeWindow.style.transition = 'transform 0.1s ease-out';
            codeWindow.classList.add('is-tilted');
        } else {
            if (codeWindow.classList.contains('is-tilted')) {
                codeWindow.style.transform = '';
                codeWindow.style.transition = 'transform 0.5s ease-out';
                codeWindow.classList.remove('is-tilted');
            }
        }
    });

    heroSection.addEventListener('mouseleave', () => {
        codeWindow.style.transform = '';
        codeWindow.style.transition = 'transform 0.5s ease-out';
        codeWindow.classList.remove('is-tilted');

        heroContent.style.transform = '';
        heroContent.style.transition = 'transform 0.5s ease-out';
        heroContent.classList.remove('is-tilted');
    });
}

