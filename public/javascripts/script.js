const carouselImages = document.querySelector('.carousel-images');
const totalImages = carouselImages.children.length; // Número total de imágenes en el carrusel
let currentIndex = 0;

function moveCarousel() {
    currentIndex = (currentIndex + 1) % totalImages; // Avanza al siguiente índice, reiniciando si alcanza el final
    carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`; // Desplaza al siguiente slide
}

// Ejecuta el carrusel cada 3 segundos
setInterval(moveCarousel, 3000);