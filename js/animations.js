/* ==========================================================================
   PORTFOLIO ADVANCED ANIMATIONS SCRIPT
   Author: Sumit Tiwari
   Handles: Custom Cursor, Canvas Particle System, typing effect, Intersection 
            Observer for reveals, counter stats, skill bars, and project tilt
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. CUSTOM CURSOR TRAILING EFFECT
    // ----------------------------------------------------------------------
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    // Friction factor for lagging cursor ring (lower = smoother/slower)
    const friction = 0.16;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant position for the inner dot
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        
        // Detect Hovering on clickable elements to trigger grow animations
        const target = e.target;
        const isClickable = target.closest('a') || 
                            target.closest('button') || 
                            target.closest('.social-icon') || 
                            target.closest('.theme-toggle') || 
                            target.closest('.form-input') ||
                            target.closest('.logo') ||
                            target.style.cursor === 'pointer';
                            
        if (isClickable) {
            document.body.classList.add('cursor-hover');
        } else {
            document.body.classList.remove('cursor-hover');
        }
    });

    // Make the outer circle lag smoothly behind the dot
    function animateCursor() {
        outlineX += (mouseX - outlineX) * friction;
        outlineY += (mouseY - outlineY) * friction;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Hide custom cursor when mouse leaves browser window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = 0;
        cursorOutline.style.opacity = 0;
    });
    
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;
    });


    // ----------------------------------------------------------------------
    // 2. HERO TYPING ANIMATION
    // ----------------------------------------------------------------------
    const typingText = document.getElementById('typing-text');
    const roles = ["Java Developer", "Web Developer", "DSA Enthusiast", "Problem Solver"];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function handleTyping() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Remove character
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40; // erase faster
        } else {
            // Add character
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120; // typing speed
        }

        // Typing finished a word
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at full word
        } 
        // Erase finished a word
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length; // cycle next role
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(handleTyping, typeSpeed);
    }
    
    // Start typing cycle
    if (typingText) {
        setTimeout(handleTyping, 1000);
    }


    // ----------------------------------------------------------------------
    // 3. CANVAS PARTICLE SYSTEM (THEME-REACTIVE)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const maxParticles = 65;
    const connectionDistance = 110;

    // Handle Canvas Resize
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on wall boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }

        draw(color) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    // Initialize Particle Array
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    // Redraw loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get active theme colors on every cycle
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const particleColor = isDark ? 'rgba(47, 105, 255, 0.45)' : 'rgba(0, 85, 255, 0.25)';
        const lineColor = isDark ? 'rgba(144, 38, 255, 0.08)' : 'rgba(119, 0, 255, 0.05)';

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw(particleColor);
            
            // Proximity connection logic
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);


    // ----------------------------------------------------------------------
    // 4. INTERSECTION OBSERVER (REVEAL ON SCROLL & STATS & TIMELINE)
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');
    const statCounters = document.querySelectorAll('.stat-number, .counter-number');
    const skillsSection = document.getElementById('skills');

    // Section/Element Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a timeline item, highlight its dot
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.12, // triggers when 12% is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stats Counters Increments Observer
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const limit = parseInt(target.getAttribute('data-target'));
                let count = 0;
                const duration = 1800; // time in ms
                const stepTime = Math.max(Math.floor(duration / limit), 10);
                
                const counter = setInterval(() => {
                    count += Math.ceil(limit / 50); // increment steps
                    if (count >= limit) {
                        target.textContent = limit + (limit === 100 ? '%' : '+');
                        clearInterval(counter);
                    } else {
                        target.textContent = count + (limit === 100 ? '%' : '+');
                    }
                }, stepTime);
                
                counterObserver.unobserve(target); // trigger once only
            }
        });
    }, { threshold: 0.5 });

    statCounters.forEach(counter => counterObserver.observe(counter));

    // Skill Bar Fill-up Trigger
    if (skillsSection) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillsSection.classList.add('active');
                    
                    // Manually populate exact percentage widths
                    const progressLines = document.querySelectorAll('.progress-line');
                    progressLines.forEach(line => {
                        const span = line.querySelector('span');
                        const percent = line.getAttribute('data-percent');
                        span.style.width = percent;
                    });
                    
                    skillObserver.unobserve(skillsSection); // run once
                }
            });
        }, { threshold: 0.2 });
        
        skillObserver.observe(skillsSection);
    }


    // ----------------------------------------------------------------------
    // 5. 3D TILT EFFECT ON PROJECT CARDS
    // ----------------------------------------------------------------------
    const tiltCards = document.querySelectorAll('.tilt-element');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            
            // Cursor position relative to the card bounds
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            // Normalize coordinates between -0.5 and 0.5
            const normX = x / cardRect.width - 0.5;
            const normY = y / cardRect.height - 0.5;
            
            // Calculate tilt degrees (Max tilt = 8deg)
            const tiltX = (normY * 12).toFixed(2);
            const tiltY = -(normX * 12).toFixed(2);
            
            // Apply rotatory transform and light card translate
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Reset positions smoothly when cursor leaves
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // disables transition during mouse move for fluid feel
        });
    });
});
