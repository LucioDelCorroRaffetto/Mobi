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

// Inicialización del carrusel
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const items = Array.from(document.querySelectorAll('.carousel-item'));
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    
    if (!track || items.length === 0) return;

    let currentPosition = 0;
    let itemWidth = items[0].offsetWidth;
    let itemsPerView = calculateItemsPerView();
    let maxPosition = Math.max(0, items.length - itemsPerView);

    function calculateItemsPerView() {
        const containerWidth = track.parentElement.offsetWidth;
        const gap = 20; // Espacio entre elementos
        return Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));
    }

    function updateCarousel() {
        const translateX = currentPosition * -(itemWidth + 20); // 20px es el gap
        track.style.transform = `translateX(${translateX}px)`;
        
        // Actualizar estado de los botones
        if (prevButton) prevButton.disabled = currentPosition <= 0;
        if (nextButton) nextButton.disabled = currentPosition >= maxPosition;
    }

    // Event listeners para los botones
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentPosition > 0) {
                currentPosition--;
                updateCarousel();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentPosition < maxPosition) {
                currentPosition++;
                updateCarousel();
            }
        });
    }

    // Filtrado de propiedades
    const filterSelect = document.querySelector('#propertyFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const selectedValue = this.value.toLowerCase();
            
            items.forEach(item => {
                const tipo = item.getAttribute('data-tipo').toLowerCase();
                if (selectedValue === 'todos' || tipo === selectedValue) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });

            // Recalcular posiciones después del filtrado
            itemsPerView = calculateItemsPerView();
            maxPosition = Math.max(0, items.filter(item => item.style.display !== 'none').length - itemsPerView);
            currentPosition = 0;
            updateCarousel();
        });
    }

    // Manejar cambios de tamaño de ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            itemWidth = items[0].offsetWidth;
            itemsPerView = calculateItemsPerView();
            maxPosition = Math.max(0, items.length - itemsPerView);
            currentPosition = Math.min(currentPosition, maxPosition);
            updateCarousel();
        }, 250);
    });

    // Inicialización
    updateCarousel();
});