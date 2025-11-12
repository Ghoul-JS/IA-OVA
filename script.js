// ============================================
// MÓDULO: GESTIÓN DE NAVEGACIÓN
// ============================================
const NavigationModule = (() => {
    // Variables privadas
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Función para manejar el scroll del header
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Función para toggle del menú móvil
    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        // Cambiar icono
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    };

    // Función para cerrar menú al hacer clic en un enlace
// Función para cerrar menú y manejar clics (MODIFICADA)
const closeMenuOnClick = (e) => {
    // Si es móvil, cierra el menú
    if (window.innerWidth <= 768) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }

    // NUEVA LÓGICA: ¿Es un enlace a otra página?
    const href = e.currentTarget.getAttribute('href');
    if (href && !href.startsWith('#')) {  // Si NO empieza con # (no es scroll interno)
        // Deja que el navegador maneje el click normal (redirecciona en misma pestaña)
        return;  // No hace nada más, el enlace funciona solo
    }

    // Si ES scroll interno (empieza con #), haz el scroll suave
    e.preventDefault();
    const targetId = href;
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

    // Función de inicialización
    const init = () => {
        // Event listeners
        window.addEventListener('scroll', handleScroll);
        menuToggle.addEventListener('click', toggleMenu);
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenuOnClick);
        });
    };

    // API pública
    return { init };
})();

// ============================================
// MÓDULO: GESTIÓN DE FORMULARIO
// ============================================
const FormModule = (() => {
    // Variables privadas
    const form = document.getElementById('contactForm');
    const inputs = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    // Expresiones regulares para validación
    const patterns = {
        name: /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]{3,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        subject: /^.{5,100}$/,
        message: /^.{10,500}$/
    };

    // Función para validar un campo individual
    const validateField = (fieldName, value) => {
        const pattern = patterns[fieldName];
        return pattern.test(value.trim());
    };

    // Función para mostrar error en un campo
    const showError = (fieldName) => {
        const input = inputs[fieldName];
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
    };

    // Función para quitar error de un campo
    const removeError = (fieldName) => {
        const input = inputs[fieldName];
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
    };

    // Función para validar todo el formulario
    const validateForm = () => {
        let isValid = true;
        // Validar cada campo
        for (let fieldName in inputs) {
            const value = inputs[fieldName].value;
            if (!validateField(fieldName, value)) {
                showError(fieldName);
                isValid = false;
            } else {
                removeError(fieldName);
            }
        }
        return isValid;
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        // Validar formulario
        if (validateForm()) {
            // Simular envío exitoso
            console.log('Formulario válido. Datos:', {
                name: inputs.name.value,
                email: inputs.email.value,
                subject: inputs.subject.value,
                message: inputs.message.value
            });
            // Mostrar modal de éxito
            ModalModule.openSuccess();
            // Limpiar formulario
            form.reset();
            // Quitar todos los errores
            for (let fieldName in inputs) {
                removeError(fieldName);
            }
        }
    };

    // Función para validación en tiempo real
    const handleInput = (e) => {
        const fieldName = e.target.name;
        const value = e.target.value;
        if (value.trim() !== '') {
            if (validateField(fieldName, value)) {
                removeError(fieldName);
            } else {
                showError(fieldName);
            }
        } else {
            removeError(fieldName);
        }
    };

    // Función de inicialización
    const init = () => {
        // Event listener para submit
        form.addEventListener('submit', handleSubmit);
        // Event listeners para validación en tiempo real
        for (let fieldName in inputs) {
            inputs[fieldName].addEventListener('input', handleInput);
            inputs[fieldName].addEventListener('blur', handleInput);
        }
    };

    // API pública
    return { init };
})();

// ============================================
// MÓDULO: GESTIÓN DE MODALES
// ============================================
const ModalModule = (() => {
    // Función para abrir modal de proyecto
    const open = (projectId) => {
        const modal = document.getElementById(`modal${projectId.charAt(0).toUpperCase() + projectId.slice(1)}`);
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            // Focus en el botón de cerrar
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) closeBtn.focus();
        }
    };

    // Función para cerrar modal de proyecto
    const close = (projectId) => {
        const modal = document.getElementById(`modal${projectId.charAt(0).toUpperCase() + projectId.slice(1)}`);
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    // Función para abrir modal de éxito
    const openSuccess = () => {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            // Cerrar automáticamente después de 3 segundos
            setTimeout(closeSuccess, 3000);
        }
    };

    // Función para cerrar modal de éxito
    const closeSuccess = () => {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    // Función para cerrar modal al hacer clic fuera
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('modal')) {
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        }
    };

    // Función para manejar tecla Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        }
    };

    // Función de inicialización
    const init = () => {
        // Event listeners para cerrar modales
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
    };

    // API pública
    return { init, open, close, openSuccess, closeSuccess };
})();

// ============================================
// MÓDULO: ANIMACIONES Y EFECTOS
// ============================================
const AnimationModule = (() => {
    // Función para observar elementos y añadir animaciones
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        // Observar todas las cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => observer.observe(card));
    };

    // Función de inicialización
    const init = () => {
        // Iniciar observador cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', observeElements);
        } else {
            observeElements();
        }
    };

    // API pública
    return { init };
})();

// ============================================
// MÓDULO: GESTIÓN DE CARRUSEL
// ============================================
const CarouselModule = (() => {
    const init = () => {
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach(carousel => {
            const inner = carousel.querySelector('.carousel-inner');
            const items = inner.querySelectorAll('.carousel-item');
            const prevBtn = carousel.querySelector('.prev');
            const nextBtn = carousel.querySelector('.next');
            let currentIndex = 0;
            const totalItems = items.length;

            const getVisibleItems = () => {
                return window.innerWidth > 768 ? 3 : 1;
            };

            const updateCarousel = () => {
                const visible = getVisibleItems();
                const itemWidth = 100 / visible;
                items.forEach(item => {
                    item.style.flex = `0 0 ${itemWidth}%`;
                });
                inner.style.transform = `translateX(-${currentIndex * itemWidth}%)`;
            };

            const nextSlide = () => {
                const visible = getVisibleItems();
                if (currentIndex < totalItems - visible) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            };

            const prevSlide = () => {
                const visible = getVisibleItems();
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = totalItems - visible;
                }
                updateCarousel();
            };

            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);
            window.addEventListener('resize', updateCarousel);

            // Soporte para swipe en mobile
            let touchStartX = 0;
            let touchEndX = 0;
            inner.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });
            inner.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeThreshold = 50;
                if (touchStartX - touchEndX > swipeThreshold) {
                    nextSlide();
                } else if (touchEndX - touchStartX > swipeThreshold) {
                    prevSlide();
                }
            });

            updateCarousel();
        });
    };

    return { init };
})();

// ============================================
// FUNCIONES GLOBALES PARA ONCLICK
// ============================================
function openModal(projectId) {
    ModalModule.open(projectId);
}

function closeModal(projectId) {
    ModalModule.close(projectId);
}

function closeSuccessModal() {
    ModalModule.closeSuccess();
}

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================
const App = (() => {
    const init = () => {
        // Inicializar todos los módulos
        NavigationModule.init();
        FormModule.init();
        ModalModule.init();
        AnimationModule.init();
        CarouselModule.init();
        console.log('%c✓ Aplicación inicializada correctamente', 'color: #10b981; font-weight: bold; font-size: 14px;');
        console.log('%cDesarrollado con ❤️ siguiendo las mejores prácticas', 'color: #6366f1; font-size: 12px;');
    };
    return { init };
})();

// Inicializar aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}