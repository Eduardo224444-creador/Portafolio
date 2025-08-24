// ============================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    // Inicializar todas las funcionalidades
    initNavigation();
    initTypingEffect();
    initProjectSlider();
    initSkillsAnimation();
    initContactForm();
    initScrollEffects();
    initImagePlaceholders();
}

// ============================================
// NAVEGACIÓN Y MENÚ MÓVIL
// ============================================
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle del menú móvil
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Scroll suave y navegación activa
    initSmoothScrolling();
    initActiveNavigation();
}

function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Ejecutar al cargar
}

// ============================================
// EFECTO DE ESCRITURA (TYPING EFFECT)
// ============================================
function initTypingEffect() {
    const typedTextElement = document.getElementById('typed-text');
    const texts = [
        'Desarrollador Web Frontend',
        'Estudiante de Ingeniería',
        'Creador de Experiencias Digitales',
        'Apasionado por la Tecnología'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Borrando texto
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            // Escribiendo texto
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
        
        // Lógica de control del typing
        if (!isDeleting && charIndex === currentText.length) {
            // Texto completo, pausar y luego borrar
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Texto borrado completamente, pasar al siguiente
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Iniciar el efecto
    typeWriter();
}

// ============================================
// SLIDER DE PROYECTOS
// ============================================
function initProjectSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.project-slide').length;
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        const translateX = -slideIndex * 100;
        sliderContainer.style.transform = `translateX(${translateX}%)`;
        
        // Actualizar dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prev);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-play (opcional)
    setInterval(nextSlide, 5000);
    
    // Touch/Swipe support para móvil
    let startX = 0;
    let startY = 0;
    
    sliderContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    sliderContainer.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Solo si es un swipe horizontal
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startX = 0;
        startY = 0;
    });
}

// ============================================
// ANIMACIÓN DE HABILIDADES
// ============================================
function initSkillsAnimation() {
    const skillCards = document.querySelectorAll('.skill-card');
    const progressBars = document.querySelectorAll('.progress');
    
    function animateSkills() {
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    }
    
    // Intersection Observer para animar cuando entre en vista
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar cards con retraso escalonado
                skillCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                // Animar barras de progreso
                setTimeout(animateSkills, 500);
                
                skillsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        // Inicializar cards como invisible
        skillCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
        });
        
        skillsObserver.observe(skillsSection);
    }
}

// ============================================
// FORMULARIO DE CONTACTO
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        let isValid = true;
        let errorMessage = '';
        
        // Validaciones específicas
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor ingresa un email válido';
                }
                break;
                
            case 'subject':
                if (value.length < 5) {
                    isValid = false;
                    errorMessage = 'El asunto debe tener al menos 5 caracteres';
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                }
                break;
        }
        
        // Mostrar/ocultar error
        if (!isValid) {
            errorElement.textContent = errorMessage;
            field.style.borderColor = '#ef4444';
        } else {
            errorElement.textContent = '';
            field.style.borderColor = '#22c55e';
        }
        
        return isValid;
    }
    
    function clearError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        errorElement.textContent = '';
        field.style.borderColor = '#d1d5db';
    }
    
    function validateForm() {
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    function submitForm() {
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Mostrar estado de carga
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        // Simular envío (reemplazar con envío real al backend)
        const formData = new FormData(contactForm);
        
        // Simular delay de envío
        setTimeout(() => {
            // Aquí iría la llamada real al backend
            // fetch('php/contact.php', { method: 'POST', body: formData })
            
            // Simulación de éxito
            showMessage('¡Mensaje enviado correctamente! Te responderé pronto.', 'success');
            contactForm.reset();
            
            // Restaurar botón
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            
            // Limpiar estilos de validación
            inputs.forEach(input => {
                input.style.borderColor = '#d1d5db';
            });
            
        }, 2000);
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// ============================================
// EFECTOS DE SCROLL
// ============================================
function initScrollEffects() {
    // Header transparente/sólido
    const header = document.querySelector('.header');
    
    function updateHeader() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Ejecutar al cargar
    
    // Animaciones al hacer scroll (Intersection Observer)
    initScrollAnimations();
}

function initScrollAnimations() {
    // Elementos a animar
    const animatedElements = document.querySelectorAll('.about-content, .contact-content, .project-slide');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Inicializar elementos como invisibles y observarlos
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease-out';
        scrollObserver.observe(element);
    });
}

// ============================================
// MANEJO DE IMÁGENES PLACEHOLDER
// ============================================
function initImagePlaceholders() {
    // Función para manejar imágenes que no cargan
    function handleImageError(img, placeholderIcon) {
        img.style.display = 'none';
        
        // Crear elemento placeholder
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: white;
        `;
        placeholder.textContent = placeholderIcon;
        
        img.parentNode.appendChild(placeholder);
    }
    
    // Imagen de perfil
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.onerror = function() {
            handleImageError(this, '👤');
        };
        
        // Si no tiene src, mostrar placeholder inmediatamente
        if (!profileImg.src || profileImg.src.includes('profile.jpg')) {
            handleImageError(profileImg, '👤');
        }
    }
    
    // Imágenes de proyectos
    const projectImages = ['project1-img', 'project2-img', 'project3-img'];
    const projectIcons = ['🛒', '📋', '💼'];
    
    projectImages.forEach((imgId, index) => {
        const img = document.getElementById(imgId);
        if (img) {
            img.onerror = function() {
                handleImageError(this, projectIcons[index]);
            };
            
            // Si no tiene src válida, mostrar placeholder
            if (!img.src || img.src.includes('proyecto')) {
                handleImageError(img, projectIcons[index]);
            }
        }
    });
}

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

// Función para detectar dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para throttle en eventos de scroll
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimizar eventos de scroll con throttle
window.addEventListener('scroll', throttle(function() {
    // Aquí van las funciones que se ejecutan en scroll
}, 16)); // ~60fps

// ============================================
// EFECTOS ADICIONALES Y MEJORAS UX
// ============================================

// Lazy loading para imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Particles effect para el hero (opcional)
function initParticlesEffect() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    `;
    
    // Crear partículas
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    hero.insertBefore(particlesContainer, hero.firstChild);
}

// Cursor personalizado (opcional)
function initCustomCursor() {
    if (isMobile()) return; // No en móvil
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #2563eb;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Efectos en hover
    const hoverElements = document.querySelectorAll('a, button, .skill-card');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

// ============================================
// PERFORMANCE Y OPTIMIZACIONES
// ============================================

// Preload de imágenes críticas
function preloadImages() {
    const criticalImages = [
        'img/profile.jpg',
        'img/proyecto1.jpg',
        'img/proyecto2.jpg',
        'img/proyecto3.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Optimización de resize events
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Reajustar elementos si es necesario
        if (window.innerWidth > 768 && document.querySelector('.nav-menu').classList.contains('active')) {
            document.querySelector('.nav-menu').classList.remove('active');
            document.querySelector('.nav-toggle').classList.remove('active');
        }
    }, 250);
});

// ============================================
// INICIALIZACIÓN ADICIONAL
// ============================================

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar efectos adicionales después de un breve delay
    setTimeout(() => {
        initLazyLoading();
        // initParticlesEffect(); // Descomentar si se desea
        // initCustomCursor(); // Descomentar si se desea
        preloadImages();
    }, 500);
});

// Service Worker para cache (PWA básico)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

// ============================================
// EASTER EGGS Y DETALLES DIVERTIDOS
// ============================================

// Konami code easter egg
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konami.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.toString() === konami.toString()) {
        // Easter egg activado
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        // Crear CSS para el efecto rainbow
        if (!document.querySelector('#rainbow-style')) {
            const style = document.createElement('style');
            style.id = 'rainbow-style';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
});

// Console message para desarrolladores
console.log('%c🚀 ¡Hola desarrollador! 👨‍💻', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%c¿Te gusta mi código? ¡Contáctame! 📧', 'color: #059669; font-size: 14px;');
console.log('%cGitHub: https://github.com/tuusuario', 'color: #6366f1; font-size: 12px;');

// ============================================
// ANALYTICS Y TRACKING (OPCIONAL)
// ============================================
function trackEvent(category, action, label) {
    // Implementar tracking con Google Analytics, etc.
    console.log(`Event: ${category} - ${action} - ${label}`);
}

// Tracking de clicks en botones importantes
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary')) {
        trackEvent('Button', 'Click', 'Primary CTA');
    }
    
    if (e.target.closest('.social-link')) {
        trackEvent('Social', 'Click', 'Social Media Link');
    }
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================
window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.error);
    // Aquí se podría enviar el error a un servicio de logging
});

// Manejo de errores en Promises
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejection no manejada:', e.reason);
    e.preventDefault();
});

// ============================================
// MODO OSCURO (OPCIONAL)
// ============================================
function initDarkModeToggle() {
    // Crear toggle button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--primary-color);
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(darkModeToggle);
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        
        // Guardar preferencia
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    // Cargar preferencia guardada
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️';
    }
}

// Inicializar modo oscuro (descomenta si quieres usarlo)
// setTimeout(initDarkModeToggle, 1000);