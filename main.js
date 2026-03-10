// ===========================
// EVENT TICKER CONFIGURATION
// ===========================
// Edit the settings below to update your event ticker

const TICKER_CONFIG = {
    // Set to true to show the ticker, false to hide it completely
    enabled: true,

    // Your event message
        message: "I will be FILMING LIVE at Prosper Show 2026 in Las Vegas from 3/10 to 3/12!",

    // Optional: Add a link (leave empty "" for no link)
    link: "https://www.linkedin.com/in/jaspinall/",

    // Link button text (only shows if link is provided)
    linkText: "Click to find me!",

    // Icon options: "📢" (megaphone), "🔴" (red dot), "⚡" (lightning), "🎯" (target), "✨" (sparkles), "🚀" (rocket), "💥" (boom), "🎪" (circus tent)
    icon: "📢"
};

// Ticker animation and behavior
function initTicker() {
    const ticker = document.getElementById('event-ticker');
    const messageEl = document.getElementById('ticker-message');
    const messageClone = document.getElementById('ticker-message-clone');
    const iconEl = document.querySelector('.ticker-icon');

    if (!TICKER_CONFIG.enabled || !TICKER_CONFIG.message) {
        ticker.style.display = 'none';
        return;
    }

    // Set icon
    if (TICKER_CONFIG.icon) {
        iconEl.textContent = TICKER_CONFIG.icon;
    }

    // Build message content
    let messageContent = TICKER_CONFIG.message;
    if (TICKER_CONFIG.link) {
        messageContent += ' \u2022 ';
    }

    // Set message (with extra spacing for scrolling effect)
    const fullMessage = messageContent + '   '.repeat(10);

    if (TICKER_CONFIG.link) {
        // Create message with link
        const textNode = document.createTextNode(fullMessage);
        const linkEl = document.createElement('a');
        linkEl.href = TICKER_CONFIG.link;
        linkEl.className = 'ticker-link';
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';
        linkEl.textContent = TICKER_CONFIG.linkText;

        messageEl.innerHTML = '';
        messageEl.appendChild(textNode);
        messageEl.appendChild(linkEl);

        // Clone for seamless loop
        messageClone.innerHTML = '';
        const textNodeClone = document.createTextNode(fullMessage);
        const linkElClone = linkEl.cloneNode(true);
        messageClone.appendChild(textNodeClone);
        messageClone.appendChild(linkElClone);
    } else {
        messageEl.textContent = fullMessage;
        messageClone.textContent = fullMessage;
    }

    // Slide down animation
    setTimeout(() => {
        ticker.classList.add('ticker-visible');
    }, 500);

    // Hide on scroll
    let hasScrolled = false;
    window.addEventListener('scroll', () => {
        if (!hasScrolled && window.scrollY > 100) {
            hasScrolled = true;
            ticker.classList.remove('ticker-visible');
        }
    });
}

function closeTicker() {
    const ticker = document.getElementById('event-ticker');
    ticker.classList.remove('ticker-visible');
}

// Initialize ticker when page loads
document.addEventListener('DOMContentLoaded', initTicker);

// Mobile menu
document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.querySelector('.mobile-menu-toggle');
    var navLinks = document.getElementById('nav-links');
    if (toggle && navLinks) {
        toggle.addEventListener('click', function() {
            var isOpen = navLinks.classList.toggle('nav-open');
            toggle.classList.toggle('active');
            toggle.setAttribute('aria-expanded', isOpen);
            toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });
        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('nav-open');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open navigation menu');
            });
        });
    }

    // FAQ keyboard accessibility
    document.querySelectorAll('.faq-item-modern').forEach(function(item) {
        function toggleFaq() {
            var isActive = item.classList.toggle('active');
            item.setAttribute('aria-expanded', isActive);
        }
        item.addEventListener('click', toggleFaq);
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFaq();
            }
        });
    });
});

// Lightbox functions
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightbox.style.display = 'flex';
    setTimeout(() => {
        lightbox.classList.add('active');
        lightboxImg.src = imageSrc;
    }, 10);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    setTimeout(() => {
        lightbox.style.display = 'none';
    }, 300);
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Animated counter for metrics
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const suffix = element.textContent.slice(-1);
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        if (isDecimal) {
            element.textContent = current.toFixed(1) + suffix;
        } else if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Intersection Observer for metrics animation
const observerOptions = {
    threshold: 0.3,
    rootMargin: '-100px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.metric-number[data-target]');
            counters.forEach(counter => {
                animateCounter(counter);
                counter.removeAttribute('data-target'); // Animate only once
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe metrics section
const metricsSection = document.querySelector('.metrics-section');
if (metricsSection) {
    observer.observe(metricsSection);
}
