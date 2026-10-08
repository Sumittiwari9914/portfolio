/* ==========================================================================
   PORTFOLIO CORE SCRIPT
   Author: Sumit Tiwari
   Handles: Preloader, Theme Toggling, Sticky Nav, Mobile Menu, Active Scroll,
            Scroll Progress, Validation, and Back-to-Top
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. PAGE PRELOADER LOGIC
    // ----------------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        // Allow the preloader animation to complete and fade out
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('fade-out');
                // Remove from layout after fade transition ends (600ms)
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }
        }, 1200);
    });

    // Fallback if load event takes too long
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }
    }, 4000);

    // ----------------------------------------------------------------------
    // 2. THEME TOGGLER (DARK MODE BY DEFAULT)
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        let newTheme = 'dark';
        
        if (currentTheme === 'dark') {
            newTheme = 'light';
        }
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ----------------------------------------------------------------------
    // 3. STICKY HEADER & SCROLL PROGRESS INDICATOR
    // ----------------------------------------------------------------------
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Sticky Header Toggle
        if (scrollTop > 20) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Scroll Progress Bar Update
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        } else {
            scrollProgress.style.width = '0%';
        }

        // Back to Top Button Toggle
        if (scrollTop > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    // Back to top button action
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ----------------------------------------------------------------------
    // 4. MOBILE MENU INTERACTION
    // ----------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Open/Close menu
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside of navigation menu
    document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ----------------------------------------------------------------------
    // 5. ACTIVE NAVIGATION ITEM TRACKING ON SCROLL
    // ----------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActiveTracker() {
        const scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset matches sticky header + padding
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    targetLink.classList.add('active');
                } else {
                    targetLink.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', scrollActiveTracker);
    scrollActiveTracker(); // initial trigger

    // ----------------------------------------------------------------------
    // 6. CONTACT FORM VALIDATION & INTERACTIVE STATE
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');
            
            let isValid = true;
            
            // Name validation
            if (!nameInput.value.trim()) {
                showError(nameInput, 'name-error');
                isValid = false;
            } else {
                clearError(nameInput, 'name-error');
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showError(emailInput, 'email-error', 'Please enter your email');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'email-error', 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput, 'email-error');
            }
            
            // Message validation
            if (!messageInput.value.trim()) {
                showError(messageInput, 'message-error');
                isValid = false;
            } else {
                clearError(messageInput, 'message-error');
            }
            
            if (isValid) {
                // Mock form sending success state
                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalText = submitBtn.querySelector('span').textContent;
                
                submitBtn.disabled = true;
                submitBtn.querySelector('span').textContent = 'Sending Message...';
                submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';
                
                setTimeout(() => {
                    submitBtn.querySelector('span').textContent = 'Message Sent!';
                    submitBtn.querySelector('i').className = 'fa-solid fa-circle-check';
                    submitBtn.style.background = 'linear-gradient(135deg, #00b0ff 0%, #00e5ff 100%)';
                    
                    // Reset Form
                    contactForm.reset();
                    
                    // Reset button to original state after 3 seconds
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.querySelector('span').textContent = originalText;
                        submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';
                        submitBtn.style.background = ''; // returns to default CSS gradient variable
                    }, 3000);
                }, 1500);
            }
        });
        
        // Inline validations on input typing
        contactForm.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group.classList.contains('invalid')) {
                    group.classList.remove('invalid');
                }
            });
        });
    }

    function showError(input, errorId, customText) {
        const group = input.closest('.form-group');
        const errorSpan = document.getElementById(errorId);
        group.classList.add('invalid');
        if (customText && errorSpan) {
            errorSpan.textContent = customText;
        }
    }

    function clearError(input, errorId) {
        const group = input.closest('.form-group');
        group.classList.remove('invalid');
    }
});
