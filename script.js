/* ============================================
   Auntyperemense TV - JAVASCRIPT
   Interactive Functionality & Animations
   ============================================ */

// -------- DOCUMENT READY & INITIALIZATION --------
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeIntro();
    initializeNavigation();
    initializeTypingEffect();
    initializeScrollReveal();
    initializeCounters();
    initializeBackToTop();
    initializeContactForm();
});

// -------- LOADER --------
/**
 * Initializes and manages the loading animation
 * Automatically hides after 2 seconds
 */
/**
 * Initializes the cinematic intro overlay:
 * - particle canvas
 * - letter-by-letter reveal for logo
 * - light streak and timed fade into hero
 */
function initializeIntro() {
    const overlay = document.getElementById('introOverlay');
    const logo = document.getElementById('introLogo');
    const canvas = document.getElementById('introParticles');

    if (!overlay || !logo || !canvas) {
        // no overlay present, nothing to do
        return;
    }

    // prevent scrolling during intro splash screen
    document.body.style.overflow = 'hidden';

    // resize canvas to full viewport
    function fitCanvas() {
        canvas.width = window.innerWidth * devicePixelRatio;
        canvas.height = window.innerHeight * devicePixelRatio;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    const ctx = canvas.getContext('2d');
    const particles = [];

    function spawnParticle() {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.2 - Math.random() * 0.6,
            r: 0.6 + Math.random() * 2.4,
            life: 100 + Math.random() * 200
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 1;
            const alpha = Math.max(0, Math.min(1, p.life / 240));
            ctx.fillStyle = `rgba(31,182,255,${alpha * 0.18})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            if (p.life <= 0 || p.y < -50) particles.splice(i, 1);
        }
    }

    // animate loop
    let running = true;
    function loop() {
        if (!running) return;
        if (Math.random() < 0.6) spawnParticle();
        drawParticles();
        requestAnimationFrame(loop);
    }

    // split logo text into spans for staggered animation
    const text = logo.textContent.trim();
    logo.textContent = '';
    const chars = [];
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = text[i];
        logo.appendChild(span);
        chars.push(span);
    }

    // fit canvas and start
    fitCanvas();
    window.addEventListener('resize', fitCanvas);
    loop();

    // stagger characters animation
    chars.forEach((ch, idx) => {
        const delay = 180 + idx * 55; // nicer cinematic stagger
        setTimeout(() => {
            ch.style.animation = `charIn 520ms cubic-bezier(.2,.9,.3,1) forwards`;
            ch.style.filter = 'none';
        }, delay);
    });

    // animate light streak briefly
    const streak = overlay.querySelector('.intro-lightstreak');
    if (streak) {
        streak.style.transition = 'opacity 900ms ease-out, transform 900ms ease-out';
        setTimeout(() => streak.style.opacity = '0.28', 420);
        setTimeout(() => streak.style.opacity = '0', 1600);
    }

    // show subtle subtitle after logo
    const subtle = overlay.querySelector('.intro-subtle');
    if (subtle) {
        subtle.style.opacity = '0';
        subtle.style.transform = 'translateY(6px)';
        setTimeout(() => {
            subtle.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
            subtle.style.opacity = '1';
            subtle.style.transform = 'translateY(0)';
        }, 900 + text.length * 35);
    }

    // after cinematic duration, fade away overlay and stop particles
    const introDuration = 3600; // milliseconds total
    setTimeout(() => {
        // add fade-out class to trigger CSS transition
        overlay.classList.add('fade-out');
        running = false;
        
        // ensure hero page is immediately visible in background
        const hero = document.getElementById('home');
        if (hero) {
            hero.style.visibility = 'visible';
            hero.style.opacity = '1';
            hero.setAttribute('tabindex', '-1');
        }
        
        // re-enable scrolling and scroll to top to show hero immediately
        document.body.style.overflow = 'auto';
        window.scrollTo(0, 0);
        
        // after fade completes, completely remove overlay from DOM to prevent blank screen
        setTimeout(() => {
            // ensure navbar is visible
            const navbar = document.getElementById('navbar');
            if (navbar) navbar.style.visibility = 'visible';
            
            // remove overlay from DOM completely to prevent any layout issues
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            
            // remove canvas to free memory
            if (canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        }, 900); // wait for fade transition (900ms) to complete
    }, introDuration);
}

// -------- NAVIGATION --------
/**
 * Initializes navigation features:
 * - Hamburger menu toggle
 * - Active link highlighting
 * - Sticky navbar on scroll
 */
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Add active class
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (window.scrollY >= top && window.scrollY < top + height) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
    
    // Smooth scrolling for navigation links
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset to account for fixed navbar (70px)
                const navHeight = 70;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// -------- TYPING EFFECT --------
/**
 * Creates animated typing effect for hero subtitle
 * Cycles through different roles
 */
function initializeTypingEffect() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;
    
    const roles = [
        'Content Creator | Influencer | Digital Brand',
        'Viral Content Specialist',
        'Social Media Growth Expert',
        'Brand Influencer & Storyteller',
        'Digital Creativity Pioneer'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 50;
    const delayBetweenRoles = 3000; // 3 seconds pause between roles
    
    /**
     * Main typing animation loop
     */
    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Delete character
            charIndex--;
            typingText.textContent = currentRole.substring(0, charIndex);
            typingSpeed = 30; // Faster deletion
            
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 100; // Delay before typing next role
            }
        } else {
            // Add character
            charIndex++;
            typingText.textContent = currentRole.substring(0, charIndex);
            typingSpeed = 50;
            
            if (charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = delayBetweenRoles; // Pause before deleting
            }
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    typeEffect();
}

// -------- SCROLL REVEAL ANIMATIONS --------
/**
 * Implements intersection observer for scroll reveal animations
 * Elements fade in and slide up when they come into view
 */
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    /**
     * Callback function when element enters viewport
     */
    const revealOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(revealOnScroll, observerOptions);
    revealElements.forEach(element => observer.observe(element));
}

// -------- ANIMATED COUNTERS --------
/**
 * Creates animated number counters for stats section
 * Numbers increment smoothly when section comes into view
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    let hasStarted = false;
    
    const counterOptions = {
        threshold: 0.5
    };
    
    /**
     * Increments counter value smoothly
     * @param {HTMLElement} counter - The counter element
     * @param {number} target - Target number to reach
     * @param {number} duration - Duration of animation in ms
     */
    function incrementCounter(counter, target, duration) {
        const start = 0;
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * (target - start) + start);
            
            // Format number with commas for large numbers
            counter.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        update();
    }
    
    /**
     * Callback when stats section enters viewport
     */
    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;
                
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds animation
                    incrementCounter(counter, target, duration);
                });
                
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(startCounters, counterOptions);
    const statsSection = document.querySelector('#stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// -------- BACK TO TOP BUTTON --------
/**
 * Manages back-to-top button:
 * - Shows/hides based on scroll position
 * - Smooth scroll to top on click
 */
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Smooth scroll to top on click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// -------- CONTACT FORM --------
/**
 * Handles contact form submission
 * - Validates input
 * - Displays success/error messages
 * - Resets form on success
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const formMessage = document.getElementById('formMessage');
        
        // Validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields', 'error', formMessage);
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address', 'error', formMessage);
            return;
        }
        
        // Simulate form submission
        submitForm(name, email, message, formMessage);
    });
    
    /**
     * Displays form message (success or error)
     * @param {string} message - Message text
     * @param {string} type - Message type: 'success' or 'error'
     * @param {HTMLElement} element - Message container element
     */
    function showFormMessage(message, type, element) {
        element.textContent = message;
        element.className = `form-message ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            element.className = 'form-message';
            element.textContent = '';
        }, 5000);
    }
    
    /**
     * Submits form data
     * @param {string} name - User name
     * @param {string} email - User email
     * @param {string} message - User message
     * @param {HTMLElement} formMessage - Message container
     */
    function submitForm(name, email, message, formMessage) {
        // Simulate API request with setTimeout
        setTimeout(() => {
            // Log the form data (in production, send to backend)
            console.log('Form submitted:', { name, email, message });
            
            // Show success message
            showFormMessage('✓ Message sent successfully! I\'ll get back to you soon.', 'success', formMessage);
            
            // Reset form
            contactForm.reset();
        }, 1000);
    }
}

// -------- ACCESSIBILITY IMPROVEMENTS --------
/**
 * Handles keyboard navigation for accessibility
 */
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});
