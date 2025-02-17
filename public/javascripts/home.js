// Función para cambiar el tema del sitio
// Esta función se utiliza para alternar entre el tema claro y oscuro
function changeTheme() {
    // Alternar la clase darkMode en el cuerpo del documento
    document.body.classList.toggle("darkMode");

    // Verificar el estado del tema y actualizar el almacenamiento en sesión
    if (document.body.classList.contains("darkMode")) {
        sessionStorage.setItem("theme", "darkMode");
    } else {
        sessionStorage.removeItem("theme");
    }
}

// Evento de carga para aplicar el tema guardado
window.addEventListener("load", function () {
    const theme = sessionStorage.getItem("theme");
    if (theme === "darkMode") {
        document.body.classList.add("darkMode");
    }
});

const carousel = document.querySelector('.carousel-wrapper');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function updateCarousel() {
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

document.querySelector('.next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
});

document.querySelector('.prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
}, 5000);

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const filter = document.getElementById('propertyFilter');
    
    let currentIndex = 0;
    let itemsPerView = window.innerWidth > 768 ? 3 : 1;
    
    function updateCarousel() {
        const itemWidth = items[0].offsetWidth;
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        
        // Actualizar estado de los botones
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= items.length - itemsPerView;
    }
    
    function filterProperties(tipo) {
        items.forEach(item => {
            if (tipo === 'todos' || item.dataset.tipo === tipo) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Reset position
        currentIndex = 0;
        updateCarousel();
    }
    
    // Event Listeners
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextButton.addEventListener('click', () => {
        const visibleItems = Array.from(items).filter(
            item => item.style.display !== 'none'
        );
        if (currentIndex < visibleItems.length - itemsPerView) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    filter.addEventListener('change', (e) => {
        filterProperties(e.target.value);
    });
    
    // Responsive handling
    window.addEventListener('resize', () => {
        itemsPerView = window.innerWidth > 768 ? 3 : 1;
        currentIndex = 0;
        updateCarousel();
    });
    
    // Initial setup
    updateCarousel();
});