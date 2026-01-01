/**
 * PORTFOLIO MAIN SCRIPT
 * Integrated: Navigation, Custom Cursor, Bento Grid, Portfolio Filtering, 
 * Form Validation, and Section Animations.
 */

// --- 1. INITIALIZATION & VARIABLES ---
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const backToTopBtn = document.querySelector('.back-to-top');

// --- 2. MOBILE NAVIGATION LOGIC ---
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu on link click or outside click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// --- 3. CUSTOM CURSOR LOGIC ---
if (cursorDot && cursorOutline) {
    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth elastic outline animation
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Cursor hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .bento-card, .filter-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.background = 'rgba(167, 139, 250, 0.1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.background = 'transparent';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// --- 4. SCROLL & SECTION ANIMATIONS (Intersection Observer) ---
const animateCounter = (element, target, suffix = '+') => {
    let count = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        count += increment;
        if (count < target) {
            element.textContent = Math.floor(count) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    };
    updateCounter();
};

const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };

const globalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Fade in section
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            
            // Trigger counters
            const stats = entry.target.querySelectorAll('.stat-number, .stat-value');
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (!stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, target);
                }
            });

            // Trigger skill bars
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            });
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
    section.style.transition = "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
    globalObserver.observe(section);
});

// --- 5. NAVBAR & BACK-TO-TOP SCROLL EFFECTS ---
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Navbar styling
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (currentScroll > 300) {
        backToTopBtn?.classList.add('visible');
    } else {
        backToTopBtn?.classList.remove('visible');
    }

    // Active link state logic
    let currentId = '';
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (currentScroll >= sectionTop) {
            currentId = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
        }
    });
});

// --- 6. PORTFOLIO FILTERING ---
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        portfolioItems.forEach((item) => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// --- 7. FORM SUBMISSION & NOTIFICATIONS ---
const contactForm = document.querySelector('.contact-form');

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<div class="notification-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    </div>`;
    
    // Modern notification styling
    Object.assign(notification.style, {
        position: 'fixed', top: '100px', right: '20px',
        background: type === 'success' ? '#a78bfa' : '#ef4444',
        color: 'white', padding: '1rem 1.5rem', borderRadius: '12px',
        zIndex: '10000', boxShadow: '0 10px 15px rgba(0,0,0,0.3)',
        animation: 'slideInRight 0.3s ease forwards'
    });
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            showNotification('Message sent successfully! I will reach out soon.');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// --- 8. SMOOTH SCROLL & INTERACTIVE UTILS ---
// Smooth Scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// Ripple Effect for Buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute; width: ${size}px; height: ${size}px;
            border-radius: 50%; background: rgba(255, 255, 255, 0.3);
            left: ${x}px; top: ${y}px; transform: scale(0);
            animation: ripple 0.6s ease-out; pointer-events: none;
        `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Back to Top functionality
backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- 9. CONSOLE LOG ---
console.log('%c✨ Professional Portfolio Loaded Successfully!', 'color: #a78bfa; font-size: 14px; font-weight: bold;');