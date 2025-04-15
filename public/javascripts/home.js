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

// Inicialización del carrusel de propiedades destacadas
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando carrusel...');
    
    const track = document.querySelector('.carousel-track');
    if (!track) {
        console.log('No se encontró el elemento .carousel-track');
        return; // Si no existe el carrusel, salir de la función
    }
    
    const items = document.querySelectorAll('.carousel-item');
    console.log(`Se encontraron ${items.length} elementos en el carrusel`);
    
    if (!items.length) {
        console.log('No hay elementos en el carrusel');
        return; // Si no hay elementos, salir de la función
    }
    
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const filter = document.getElementById('propertyFilter');
    
    let currentIndex = 0;
    let itemsPerView = window.innerWidth > 768 ? 3 : 1;
    
    function updateCarousel() {
        if (!track || !items.length) return;
        
        const itemWidth = items[0].offsetWidth;
        console.log(`Ancho del elemento: ${itemWidth}px, Índice actual: ${currentIndex}`);
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        
        // Actualizar estado de los botones
        if (prevButton) prevButton.disabled = currentIndex === 0;
        if (nextButton) nextButton.disabled = currentIndex >= items.length - itemsPerView;
    }
    
    function filterProperties(tipo) {
        if (!items.length) return;
        
        console.log(`Filtrando por tipo: ${tipo}`);
        
        items.forEach(item => {
            if (tipo === 'todos' || item.dataset.tipo.toLowerCase() === tipo.toLowerCase()) {
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
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            console.log('Botón anterior clickeado');
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            console.log('Botón siguiente clickeado');
            const visibleItems = Array.from(items).filter(
                item => item.style.display !== 'none'
            );
            if (currentIndex < visibleItems.length - itemsPerView) {
                currentIndex++;
                updateCarousel();
            }
        });
    }
    
    if (filter) {
        filter.addEventListener('change', (e) => {
            filterProperties(e.target.value);
        });
    }
    
    // Responsive handling
    window.addEventListener('resize', () => {
        console.log('Ventana redimensionada');
        itemsPerView = window.innerWidth > 768 ? 3 : 1;
        currentIndex = 0;
        updateCarousel();
    });
    
    // Initial setup
    console.log('Configuración inicial del carrusel');
    updateCarousel();
});