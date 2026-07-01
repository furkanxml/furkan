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
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
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
                // Header yüksekliği
                const headerHeight = document.getElementById('main-header').offsetHeight || 90;
                
                // .section 클래ı içindeki padding'i (yaklaşık 100px) aşmak için offset ekliyoruz
                // Bunu +80 gibi pozitif bir değer yaparak sayfanın DAHa aşağı kaymasını sağlıyoruz
                const offset = 80; 
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                // Sayfayı 'headerHeight' kadar yukarıda değil, ona ek olarak +80px daha aşağıda (fazladan boşluğu yutacak şekilde) durduruyoruz
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

    // Cihaz mobil mi kontrol et
    if (window.matchMedia("(max-width: 991px)").matches) return;

    // Derinlik hissiyatı için preserve-3d etkinliği
    heroContent.style.transformStyle = 'preserve-3d';

    const maxRotation = 15;

    // Tüm hero bölümünü (tavan/taban sınırı olmaksızın devasa bir alan) dinliyoruz
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        
        // Farenin Hero Section'a göre pozisyonları
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top; 
        
        const width = rect.width;
        const height = rect.height;

        // Farenin Y eksenindeki genel sapma oranı
        const centerY = height / 2;
        const percentY = (y - centerY) / centerY;

        // "ÖLÜ BÖLGE" HESAPLAMALARI
        // Üstten %15, alttan %15 ve ortadan %10'luk bir hareket etmeme bölgesi (dead zone) yaratıyoruz.
        const topBound = height * 0.15;
        const bottomBound = height * 0.85;
        const leftZoneEnd = width * 0.45;    // Ekranın %45'ine kadar sol alan
        const rightZoneStart = width * 0.55; // Ekranın %55'inden sonra sağ alan

        let isLeftActive = false;
        let isRightActive = false;

        // Eğer fare dikeyde izin verilen (daraltılmış) sınırlar içindeyse
        if (y > topBound && y < bottomBound) {
            // Ve yatayda sağa/sola çok yakınsa
            if (x < leftZoneEnd) {
                isLeftActive = true;
            } else if (x > rightZoneStart) {
                isRightActive = true;
            }
        }

        // SOL TARAF (Metin Pop-Out) Hareketi
        if (isLeftActive) {
            const leftCenterX = leftZoneEnd / 2;
            const percentX = (x - leftCenterX) / leftCenterX;

            const rotateX = -percentY * maxRotation;
            const rotateY = percentX * maxRotation;

            heroContent.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            heroContent.style.transition = 'transform 0.1s ease-out';
            heroContent.classList.add('is-tilted');
        } else {
            // Sol alandan çıkıldığında durdur
            if (heroContent.classList.contains('is-tilted')) {
                heroContent.style.transform = '';
                heroContent.style.transition = 'transform 0.5s ease-out';
                heroContent.classList.remove('is-tilted');
            }
        }

        // SAĞ TARAF (Kod Penceresi) Hareketi
        if (isRightActive) {
            const rightCenterX = rightZoneStart + ((width - rightZoneStart) / 2);
            const percentX = (x - rightCenterX) / ((width - rightZoneStart) / 2);

            const rotateX = -percentY * maxRotation;
            const rotateY = percentX * maxRotation;

            codeWindow.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            codeWindow.style.transition = 'transform 0.1s ease-out';
            codeWindow.classList.add('is-tilted');
        } else {
            // Sağ alandan çıkıldığında durdur
            if (codeWindow.classList.contains('is-tilted')) {
                codeWindow.style.transform = '';
                codeWindow.style.transition = 'transform 0.5s ease-out';
                codeWindow.classList.remove('is-tilted');
            }
        }
    });

    // Ana alandan tamamen çıkıldığında her ikisini de sıfırla
    heroSection.addEventListener('mouseleave', () => {
        codeWindow.style.transform = '';
        codeWindow.style.transition = 'transform 0.5s ease-out';
        codeWindow.classList.remove('is-tilted');
        
        heroContent.style.transform = '';
        heroContent.style.transition = 'transform 0.5s ease-out';
        heroContent.classList.remove('is-tilted');
    });

}

