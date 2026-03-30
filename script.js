/* =========================================
   Kirolos & Miriam — Wedding Website
   Full-Featured Interactive Script
   ========================================= */

(function () {
    'use strict';

    // ===== Configuration =====
    var WEDDING_DATE = new Date('2026-05-08T17:00:00');
    var WEDDING_TITLE = 'Kirolos & Miriam Wedding';
    var WEDDING_LOCATION = 'The Grand Palace, Cairo, Egypt';
    var WEDDING_END = new Date('2026-05-09T00:00:00');

    // ===== State =====
    var currentLang = 'en';
    var prevCountdown = { d: '', h: '', m: '', s: '' };
    var lightboxIndex = 0;
    var galleryItems = [];

    // ===== Init =====
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        setupPreloader();
    }


    // =========================================
    // PRELOADER
    // =========================================
    function setupPreloader() {
        var preloader = document.getElementById('preloader');
        var cover = document.getElementById('cover');

        setTimeout(function () {
            if (preloader) {
                preloader.classList.add('fade-out');
            }
            if (cover) {
                cover.classList.remove('hidden');
            }

            // Init everything after preloader
            setTimeout(function () {
                if (preloader) preloader.style.display = 'none';
                initAllFeatures();
            }, 600);
        }, 2200);
    }

    function initAllFeatures() {
        parseGuestName();
        setupCoverParticles();
        setupEnvelopeOpen();
        setupLanguageToggle();
        setupCountdown();
        setupCalendarButtons();
        setupShareButton();
        setupScrollAnimations();
        setupParallax();
        setupHeroParticles();
        setupTimelineLine();
        setupGalleryTilt();
        setupLightbox();
        setupRSVPForm();
        setupMusicToggle();
    }


    // =========================================
    // GUEST NAME FROM URL
    // =========================================
    function parseGuestName() {
        var params = new URLSearchParams(window.location.search);
        var guest = params.get('guest');
        if (guest) {
            var sanitized = sanitizeText(guest);
            var guestEl = document.querySelector('.cover-guest');
            if (guestEl) {
                guestEl.textContent = sanitized;
                guestEl.setAttribute('data-en', sanitized);
                guestEl.setAttribute('data-ar', sanitized);
            }
        }
    }

    function sanitizeText(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.textContent.substring(0, 100);
    }


    // =========================================
    // COVER PARTICLES (golden sparkles)
    // =========================================
    function setupCoverParticles() {
        var container = document.getElementById('coverParticles');
        if (!container) return;

        for (var i = 0; i < 25; i++) {
            var p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 8 + 's';
            p.style.animationDuration = (6 + Math.random() * 6) + 's';
            var size = (2 + Math.random() * 3) + 'px';
            p.style.width = size;
            p.style.height = size;
            p.style.background = Math.random() > 0.5
                ? 'var(--color-gold-light)'
                : 'var(--color-gold-muted)';
            container.appendChild(p);
        }
    }


    // =========================================
    // 3D ENVELOPE OPEN + CONFETTI
    // =========================================
    function setupEnvelopeOpen() {
        var openBtn = document.getElementById('openBtn');
        var cover = document.getElementById('cover');
        var mainContent = document.getElementById('mainContent');
        var envelope = document.getElementById('envelope');
        var waxSeal = document.getElementById('waxSeal');

        if (!openBtn || !cover || !mainContent) return;

        document.body.style.overflow = 'hidden';

        openBtn.addEventListener('click', function () {
            // Step 1: Break wax seal
            if (waxSeal) waxSeal.classList.add('broken');

            // Step 2: Open envelope flap
            setTimeout(function () {
                if (envelope) envelope.classList.add('open');
            }, 300);

            // Step 3: Fire confetti
            setTimeout(function () {
                fireConfetti('confettiCanvas');
            }, 500);

            // Step 4: Slide up invitation text
            setTimeout(function () {
                cover.classList.add('envelope-opening');
            }, 800);

            // Step 5: Fade out cover, show main
            setTimeout(function () {
                cover.classList.add('fade-away');
            }, 1400);

            setTimeout(function () {
                cover.classList.add('hidden');
                mainContent.classList.remove('hidden');
                document.body.style.overflow = 'auto';
                requestAnimationFrame(function () {
                    mainContent.classList.add('visible');
                });
            }, 2000);
        });
    }


    // =========================================
    // CONFETTI ENGINE (Canvas-based)
    // =========================================
    function fireConfetti(canvasId) {
        var canvas = document.getElementById(canvasId);
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var colors = ['#b08d57', '#d4b87a', '#c9a96e', '#f5d5a0', '#e8c88a', '#8c6d3f', '#ffffff'];
        var particles = [];

        for (var i = 0; i < 120; i++) {
            particles.push({
                x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
                y: canvas.height * 0.4,
                vx: (Math.random() - 0.5) * 12,
                vy: -Math.random() * 14 - 4,
                w: 6 + Math.random() * 6,
                h: 4 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                gravity: 0.25 + Math.random() * 0.15,
                opacity: 1
            });
        }

        var frame = 0;
        var maxFrames = 180;

        function animate() {
            if (frame >= maxFrames) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(function (p) {
                p.x += p.vx;
                p.vy += p.gravity;
                p.y += p.vy;
                p.rotation += p.rotSpeed;
                p.opacity = Math.max(0, 1 - frame / maxFrames);

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            frame++;
            requestAnimationFrame(animate);
        }

        animate();
    }


    // =========================================
    // LANGUAGE TOGGLE
    // =========================================
    function setupLanguageToggle() {
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchLanguage(this.dataset.lang);
                syncLangButtons();
            });
        });

        document.querySelectorAll('.lang-btn-main').forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchLanguage(this.dataset.lang);
                syncLangButtons();
            });
        });
    }

    function syncLangButtons() {
        document.querySelectorAll('.lang-btn, .lang-btn-main').forEach(function (b) {
            b.classList.toggle('active', b.dataset.lang === currentLang);
        });
    }

    function switchLanguage(lang) {
        currentLang = lang;
        var isArabic = lang === 'ar';

        document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);

        document.querySelectorAll('[data-en]').forEach(function (el) {
            el.textContent = isArabic ? el.getAttribute('data-ar') : el.getAttribute('data-en');
        });

        document.querySelectorAll('[data-placeholder-en]').forEach(function (el) {
            el.placeholder = isArabic
                ? el.getAttribute('data-placeholder-ar')
                : el.getAttribute('data-placeholder-en');
        });
    }


    // =========================================
    // COUNTDOWN with FLIP ANIMATION
    // =========================================
    function setupCountdown() {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        var now = Date.now();
        var distance = WEDDING_DATE.getTime() - now;

        var d, h, m, s;
        if (distance < 0) {
            d = '0'; h = '00'; m = '00'; s = '00';
        } else {
            d = String(Math.floor(distance / 86400000)).padStart(3, '0');
            h = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
            m = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
            s = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
        }

        setFlip('days', d, prevCountdown.d);
        setFlip('hours', h, prevCountdown.h);
        setFlip('minutes', m, prevCountdown.m);
        setFlip('seconds', s, prevCountdown.s);

        prevCountdown = { d: d, h: h, m: m, s: s };
    }

    function setFlip(id, newVal, oldVal) {
        var el = document.getElementById(id);
        if (!el) return;
        if (newVal !== oldVal) {
            el.textContent = newVal;
            el.classList.remove('flip');
            void el.offsetWidth; // force reflow
            el.classList.add('flip');
        }
    }


    // =========================================
    // ADD TO CALENDAR
    // =========================================
    function setupCalendarButtons() {
        var calBtn = document.getElementById('addToCalendarBtn');
        var dropdown = document.getElementById('calendarDropdown');
        var googleLink = document.getElementById('googleCalLink');
        var icsLink = document.getElementById('icsDownload');

        if (!calBtn || !dropdown) return;

        // Google Calendar link
        var startStr = formatGoogleDate(WEDDING_DATE);
        var endStr = formatGoogleDate(WEDDING_END);
        if (googleLink) {
            googleLink.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
                '&text=' + encodeURIComponent(WEDDING_TITLE) +
                '&dates=' + startStr + '/' + endStr +
                '&location=' + encodeURIComponent(WEDDING_LOCATION) +
                '&details=' + encodeURIComponent('We would love for you to celebrate with us!');
        }

        // ICS file
        if (icsLink) {
            var icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Wedding//EN',
                'BEGIN:VEVENT',
                'DTSTART:' + formatICSDate(WEDDING_DATE),
                'DTEND:' + formatICSDate(WEDDING_END),
                'SUMMARY:' + WEDDING_TITLE,
                'LOCATION:' + WEDDING_LOCATION,
                'DESCRIPTION:We would love for you to celebrate with us!',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');
            icsLink.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
        }

        calBtn.addEventListener('click', function () {
            dropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!calBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    }

    function formatGoogleDate(d) {
        return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }

    function formatICSDate(d) {
        return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }


    // =========================================
    // SHARE BUTTON (WhatsApp / native)
    // =========================================
    function setupShareButton() {
        var shareBtn = document.getElementById('shareBtn');
        if (!shareBtn) return;

        shareBtn.addEventListener('click', function () {
            var url = window.location.href.split('?')[0];
            var text = currentLang === 'ar'
                ? 'أنتم مدعوون لحضور حفل زفاف كيرلس ومريم! 💍'
                : "You're invited to Kirolos & Miriam's wedding! 💍";

            // Try native share first
            if (navigator.share) {
                navigator.share({
                    title: WEDDING_TITLE,
                    text: text,
                    url: url
                }).catch(function () {});
            } else {
                // Fallback to WhatsApp
                var waUrl = 'https://wa.me/?text=' + encodeURIComponent(text + '\n' + url);
                window.open(waUrl, '_blank', 'noopener,noreferrer');
            }
        });
    }


    // =========================================
    // SCROLL ANIMATIONS (Staggered)
    // =========================================
    function setupScrollAnimations() {
        var elements = document.querySelectorAll('.animate-on-scroll');

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var stagger = entry.target.getAttribute('data-stagger');
                    var delay = stagger ? parseInt(stagger, 10) * 120 : 0;

                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }


    // =========================================
    // PARALLAX HERO
    // =========================================
    function setupParallax() {
        var layers = document.querySelectorAll('.parallax-layer');
        if (!layers.length) return;

        window.addEventListener('scroll', function () {
            var scrollY = window.pageYOffset;
            layers.forEach(function (layer) {
                var speed = parseFloat(layer.getAttribute('data-speed')) || 0.1;
                layer.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
            });
        }, { passive: true });
    }


    // =========================================
    // HERO FLOATING PARTICLES
    // =========================================
    function setupHeroParticles() {
        var container = document.getElementById('heroParticles');
        if (!container) return;

        for (var i = 0; i < 15; i++) {
            var p = document.createElement('div');
            p.className = 'hero-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = (50 + Math.random() * 40) + '%';
            p.style.animationDelay = Math.random() * 6 + 's';
            p.style.animationDuration = (5 + Math.random() * 5) + 's';
            var size = (2 + Math.random() * 4) + 'px';
            p.style.width = size;
            p.style.height = size;
            container.appendChild(p);
        }
    }


    // =========================================
    // ANIMATED TIMELINE LINE
    // =========================================
    function setupTimelineLine() {
        var line = document.getElementById('timelineLine');
        if (!line) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    line.classList.add('grown');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(line);
    }


    // =========================================
    // GALLERY 3D TILT EFFECT
    // =========================================
    function setupGalleryTilt() {
        document.querySelectorAll('.tilt-hover').forEach(function (item) {
            item.addEventListener('mousemove', function (e) {
                var rect = item.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateY = ((x - centerX) / centerX) * 8;
                var rotateX = ((centerY - y) / centerY) * 8;
                item.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.03)';
            });

            item.addEventListener('mouseleave', function () {
                item.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }


    // =========================================
    // GALLERY LIGHTBOX
    // =========================================
    function setupLightbox() {
        var lightbox = document.getElementById('lightbox');
        var closeBtn = document.getElementById('lightboxClose');
        var prevBtn = document.getElementById('lightboxPrev');
        var nextBtn = document.getElementById('lightboxNext');
        var caption = document.getElementById('lightboxCaption');

        if (!lightbox) return;

        galleryItems = Array.from(document.querySelectorAll('[data-gallery]'));

        galleryItems.forEach(function (item, index) {
            item.addEventListener('click', function () {
                lightboxIndex = index;
                openLightbox();
            });
        });

        function openLightbox() {
            lightbox.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            updateCaption();
        }

        function closeLightbox() {
            lightbox.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        function updateCaption() {
            if (caption) {
                var isAr = currentLang === 'ar';
                caption.textContent = (isAr ? 'صورة ' : 'Photo ') + (lightboxIndex + 1);
            }
        }

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', function () {
            lightboxIndex = (lightboxIndex - 1 + galleryItems.length) % galleryItems.length;
            updateCaption();
        });
        if (nextBtn) nextBtn.addEventListener('click', function () {
            lightboxIndex = (lightboxIndex + 1) % galleryItems.length;
            updateCaption();
        });

        // Close on backdrop click
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (lightbox.classList.contains('hidden')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') { prevBtn && prevBtn.click(); }
            if (e.key === 'ArrowRight') { nextBtn && nextBtn.click(); }
        });
    }


    // =========================================
    // RSVP FORM + SUCCESS CONFETTI
    // =========================================
    function setupRSVPForm() {
        var form = document.getElementById('rsvpForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var formData = {
                name: document.getElementById('guestName').value.trim(),
                attendance: document.getElementById('attendance').value,
                guests: document.getElementById('guests').value,
                dietary: document.getElementById('dietary').value,
                message: document.getElementById('message').value.trim(),
                timestamp: new Date().toISOString()
            };

            if (!formData.name || !formData.attendance) return;

            // Store locally
            var rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
            rsvps.push(formData);
            localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));

            // Show success
            form.classList.add('hidden');
            var success = document.getElementById('rsvpSuccess');
            if (success) success.classList.remove('hidden');

            // Fire mini confetti
            fireConfetti('rsvpConfetti');

            // Add wish
            if (formData.message) {
                addWish(formData.name, formData.message);
            }
        });
    }

    function addWish(name, message) {
        var wishesList = document.getElementById('wishesList');
        if (!wishesList) return;

        var card = document.createElement('div');
        card.className = 'wish-card visible';
        card.style.animation = 'wishSlideIn 0.5s ease forwards';

        var initial = name.charAt(0).toUpperCase();
        card.innerHTML =
            '<div class="wish-avatar">' + escapeHtml(initial) + '</div>' +
            '<div class="wish-content">' +
            '<h4>' + escapeHtml(name) + '</h4>' +
            '<p>' + escapeHtml(message) + '</p></div>';

        wishesList.insertBefore(card, wishesList.firstChild);
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }


    // =========================================
    // MUSIC TOGGLE
    // =========================================
    function setupMusicToggle() {
        var toggle = document.getElementById('musicToggle');
        if (!toggle) return;

        var isPlaying = false;

        toggle.addEventListener('click', function () {
            isPlaying = !isPlaying;
            toggle.classList.toggle('playing', isPlaying);
            // Connect real audio here:
            // var audio = document.getElementById('bgMusic');
            // if (audio) isPlaying ? audio.play() : audio.pause();
        });
    }

})();
