// Animated Grid with Flowing Pulses
class AnimatedGrid {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.context || canvas.getContext('2d');
        this.resize();
        
        // Grid properties
        this.gridSize = 30;
        this.pulses = [];
        this.maxPulses = 8;
        this.pulseSpeed = 2;
        this.trailLength = 15;
        
        // Colors
        this.gridColor = 'rgba(107, 70, 193, 0.1)';
        this.pulseColors = [
            'rgba(107, 70, 193, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(96, 165, 250, 0.8)'
        ];
        
        this.init();
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    init() {
        // Create initial pulses
        for (let i = 0; i < this.maxPulses; i++) {
            setTimeout(() => {
                this.createPulse();
            }, i * 2000);
        }
    }
    
    createPulse() {
        const startX = Math.random() * (this.width / this.gridSize) | 0;
        const startY = Math.random() * (this.height / this.gridSize) | 0;
        
        const pulse = {
            x: startX,
            y: startY,
            direction: Math.random() * Math.PI * 2,
            speed: this.pulseSpeed + Math.random() * 2,
            color: this.pulseColors[Math.floor(Math.random() * this.pulseColors.length)],
            trail: [],
            life: 0,
            maxLife: 100 + Math.random() * 100
        };
        
        this.pulses.push(pulse);
    }
    
    updatePulses() {
        for (let i = this.pulses.length - 1; i >= 0; i--) {
            const pulse = this.pulses[i];
            
            // Add current position to trail
            pulse.trail.unshift({ x: pulse.x, y: pulse.y });
            if (pulse.trail.length > this.trailLength) {
                pulse.trail.pop();
            }
            
            // Move pulse
            const dx = Math.cos(pulse.direction) * pulse.speed;
            const dy = Math.sin(pulse.direction) * pulse.speed;
            
            pulse.x += dx;
            pulse.y += dy;
            pulse.life++;
            
            // Bounce off walls or change direction randomly
            if (pulse.x < 0 || pulse.x > this.width / this.gridSize ||
                pulse.y < 0 || pulse.y > this.height / this.gridSize ||
                Math.random() < 0.02) {
                pulse.direction += (Math.random() - 0.5) * Math.PI;
            }
            
            // Keep pulse in bounds
            pulse.x = Math.max(0, Math.min(pulse.x, this.width / this.gridSize));
            pulse.y = Math.max(0, Math.min(pulse.y, this.height / this.gridSize));
            
            // Remove old pulses and create new ones
            if (pulse.life > pulse.maxLife) {
                this.pulses.splice(i, 1);
                if (this.pulses.length < this.maxPulses) {
                    setTimeout(() => this.createPulse(), Math.random() * 3000);
                }
            }
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    drawPulses() {
        this.pulses.forEach(pulse => {
            // Draw trail
            pulse.trail.forEach((point, index) => {
                const alpha = (1 - index / this.trailLength) * 0.8;
                const size = (1 - index / this.trailLength) * 8 + 2;
                
                this.ctx.fillStyle = pulse.color.replace('0.8', alpha.toString());
                this.ctx.beginPath();
                this.ctx.arc(
                    point.x * this.gridSize,
                    point.y * this.gridSize,
                    size,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
                
                // Draw glow effect
                const gradient = this.ctx.createRadialGradient(
                    point.x * this.gridSize, point.y * this.gridSize, 0,
                    point.x * this.gridSize, point.y * this.gridSize, size * 2
                );
                gradient.addColorStop(0, pulse.color.replace('0.8', (alpha * 0.5).toString()));
                gradient.addColorStop(1, pulse.color.replace('0.8', '0'));
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(
                    point.x * this.gridSize,
                    point.y * this.gridSize,
                    size * 2,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            });
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.drawGrid();
        this.updatePulses();
        this.drawPulses();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile navigation toggle
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Navbar background opacity on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-item')) {
                    const progressBar = entry.target.querySelector('.skill-progress');
                    if (progressBar) {
                        const width = progressBar.style.width;
                        progressBar.style.width = '0%';
                        setTimeout(() => {
                            progressBar.style.width = width;
                        }, 200);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .contact-item, .skill-item, .about-text');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Parallax effect for floating elements
function initParallax() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Form submission handling
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }
}

// Typing effect for hero text
function initTypingEffect() {
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        const text = heroName.textContent;
        heroName.textContent = '';
        heroName.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animated grid
    const canvas = document.getElementById('gridCanvas');
    if (canvas) {
        new AnimatedGrid(canvas);
    }
    
    // Initialize other features
    initSmoothScrolling();
    initMobileNav();
    initNavbarScroll();
    initScrollAnimations();
    initParallax();
    initContactForm();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add mobile navigation styles
const mobileNavStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: rgba(10, 10, 15, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease;
            z-index: 999;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-link {
            font-size: 1.2rem;
            margin: 1rem 0;
        }
        
        .nav-toggle.active .bar:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active .bar:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;

// Inject mobile navigation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileNavStyles;
document.head.appendChild(styleSheet);
