/**
 * Glimpse 3D - Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle (Basic)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navBtn = document.querySelector('.nav-btn');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            // For a complete mobile menu, we'd toggle a class on navLinks
            // Since this is a demo, we can just alert or implement a simple toggle
            const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
            mobileBtn.setAttribute('aria-expanded', !isExpanded);
            
            // Simple toggle styling
            if (!isExpanded) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = 'var(--nav-height)';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(4, 9, 20, 0.95)';
                navLinks.style.backdropFilter = 'blur(12px)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid var(--glass-border)';
                navBtn.style.display = 'flex';
                navBtn.style.margin = '1rem auto';
            } else {
                navLinks.style.display = '';
                navBtn.style.display = '';
            }
        });
    }

    // 3. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if we don't want repeat animations
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Get all elements that need to animate
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    // 4. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    mobileBtn.click();
                }
                
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Hero 3D Card Interactive Tilt Effect (Mouse move over hero area)
    const heroVisual = document.querySelector('.hero-visual');
    const visualCard = document.querySelector('.visual-card');
    
    if (heroVisual && visualCard) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            visualCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        heroVisual.addEventListener('mouseleave', () => {
            visualCard.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
            visualCard.style.transition = 'transform 0.5s ease';
        });
        
        heroVisual.addEventListener('mouseenter', () => {
            visualCard.style.transition = 'none';
        });
    }

    // 6. Video Card GIF Hover Effect
    document.querySelectorAll('.video-card').forEach(card => {
        const thumb = card.querySelector('.video-thumbnail');
        if (!thumb) return;
        
        const gifUrl = thumb.getAttribute('data-gif');
        if (gifUrl) {
            // Preload gif on page load for smoother transition
            const img = new Image();
            img.src = gifUrl;
            
            const originalBg = thumb.style.backgroundImage;
            
            card.addEventListener('mouseenter', () => {
                thumb.style.backgroundImage = `url('${gifUrl}')`;
                card.classList.add('playing');
            });
            
            card.addEventListener('mouseleave', () => {
                thumb.style.backgroundImage = originalBg;
                card.classList.remove('playing');
            });
        }
    });
    // 7. Lightbox Gallery Logic
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const src = item.getAttribute('data-src');
                if (src) {
                    lightboxImg.src = src;
                    lightbox.classList.add('active');
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            // Timeout to clear src after fade out
            setTimeout(() => {
                if(!lightbox.classList.contains('active')) lightboxImg.src = '';
            }, 300);
        };

        lightboxClose?.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
});
