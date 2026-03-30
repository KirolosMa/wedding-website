/* =========================================
   Wedding Website - Main Script
   ========================================= */

(function () {
    'use strict';

    // ===== Configuration =====
    const WEDDING_DATE = new Date('2026-05-08T17:00:00');
    const GUEST_NAME_PARAM = 'guest';

    // ===== State =====
    let currentLang = 'en';

    // ===== DOM Ready =====
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        parseGuestName();
        setupCoverParticles();
        setupOpenButton();
        setupLanguageToggle();
        setupCountdown();
        setupScrollAnimations();
        setupRSVPForm();
        setupMusicToggle();
    }


    // ===== Guest Name from URL =====
    function parseGuestName() {
        const params = new URLSearchParams(window.location.search);
        const guest = params.get(GUEST_NAME_PARAM);
        if (guest) {
            const sanitized = sanitizeText(guest);
            const guestEl = document.querySelector('.cover-guest');
            if (guestEl) {
                guestEl.textContent = sanitized;
                guestEl.setAttribute('data-en', sanitized);
                guestEl.setAttribute('data-ar', sanitized);
            }
        }
    }

    function sanitizeText(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.textContent.substring(0, 100);
    }


    // ===== Cover Particles =====
    function setupCoverParticles() {
        const container = document.getElementById('coverParticles');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 6) + 's';
            particle.style.width = (2 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    }


    // ===== Open Button (Cover -> Main) =====
    function setupOpenButton() {
        const openBtn = document.getElementById('openBtn');
        const cover = document.getElementById('cover');
        const mainContent = document.getElementById('mainContent');

        if (!openBtn || !cover || !mainContent) return;

        openBtn.addEventListener('click', function () {
            cover.classList.add('opening');

            setTimeout(function () {
                cover.classList.add('hidden');
                mainContent.classList.remove('hidden');
                document.body.style.overflow = 'auto';

                requestAnimationFrame(function () {
                    mainContent.classList.add('visible');
                });
            }, 800);
        });

        // Lock scroll while cover is active
        document.body.style.overflow = 'hidden';
    }


    // ===== Language Toggle =====
    function setupLanguageToggle() {
        // Cover buttons
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchLanguage(this.dataset.lang);
                document.querySelectorAll('.lang-btn').forEach(function (b) { b.classList.remove('active'); });
                document.querySelectorAll('.lang-btn-main').forEach(function (b) {
                    b.classList.toggle('active', b.dataset.lang === currentLang);
                });
                this.classList.add('active');
            });
        });

        // Main content buttons
        document.querySelectorAll('.lang-btn-main').forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchLanguage(this.dataset.lang);
                document.querySelectorAll('.lang-btn-main').forEach(function (b) { b.classList.remove('active'); });
                document.querySelectorAll('.lang-btn').forEach(function (b) {
                    b.classList.toggle('active', b.dataset.lang === currentLang);
                });
                this.classList.add('active');
            });
        });
    }

    function switchLanguage(lang) {
        currentLang = lang;
        var isArabic = lang === 'ar';

        document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);

        // Update all translatable elements
        document.querySelectorAll('[data-en]').forEach(function (el) {
            el.textContent = isArabic ? el.getAttribute('data-ar') : el.getAttribute('data-en');
        });

        // Update placeholders
        document.querySelectorAll('[data-placeholder-en]').forEach(function (el) {
            el.placeholder = isArabic
                ? el.getAttribute('data-placeholder-ar')
                : el.getAttribute('data-placeholder-en');
        });
    }


    // ===== Countdown Timer =====
    function setupCountdown() {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        var now = new Date().getTime();
        var distance = WEDDING_DATE.getTime() - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(3, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }


    // ===== Scroll Animations =====
    function setupScrollAnimations() {
        var animatedElements = document.querySelectorAll(
            '.story-item, .event-card, .gallery-item, .wish-card, .rsvp-form, .map-container'
        );

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    }


    // ===== RSVP Form =====
    function setupRSVPForm() {
        var form = document.getElementById('rsvpForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var formData = {
                name: document.getElementById('guestName').value.trim(),
                attendance: document.getElementById('attendance').value,
                guests: document.getElementById('guests').value,
                message: document.getElementById('message').value.trim()
            };

            // Basic validation
            if (!formData.name || !formData.attendance) return;

            // Store in localStorage as demo (replace with actual API in production)
            var rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
            formData.timestamp = new Date().toISOString();
            rsvps.push(formData);
            localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));

            // Show success message
            form.classList.add('hidden');
            document.getElementById('rsvpSuccess').classList.remove('hidden');

            // Also add wish if message provided
            if (formData.message) {
                addWish(formData.name, formData.message);
            }
        });
    }

    function addWish(name, message) {
        var wishesList = document.getElementById('wishesList');
        if (!wishesList) return;

        var wishCard = document.createElement('div');
        wishCard.className = 'wish-card visible';
        wishCard.style.animation = 'wishSlideIn 0.5s ease forwards';

        var initial = name.charAt(0).toUpperCase();

        wishCard.innerHTML =
            '<div class="wish-avatar">' + escapeHtml(initial) + '</div>' +
            '<div class="wish-content">' +
            '<h4>' + escapeHtml(name) + '</h4>' +
            '<p>' + escapeHtml(message) + '</p>' +
            '</div>';

        wishesList.insertBefore(wishCard, wishesList.firstChild);
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }


    // ===== Music Toggle =====
    function setupMusicToggle() {
        var toggle = document.getElementById('musicToggle');
        if (!toggle) return;

        var isPlaying = false;

        toggle.addEventListener('click', function () {
            isPlaying = !isPlaying;
            toggle.classList.toggle('playing', isPlaying);

            // Placeholder: In production, add an audio element and play/pause it
            // var audio = document.getElementById('bgMusic');
            // if (audio) isPlaying ? audio.play() : audio.pause();
        });
    }

})();
