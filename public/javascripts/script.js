document.addEventListener('DOMContentLoaded', () => {
    const carouselImages = document.querySelector('.carousel-images');
    const carouselContainer = document.querySelector('.product-carousel');
    
    if (!carouselImages) {
        console.warn('No se encontró el elemento del carrusel');
        return;
    }

    const totalImages = carouselImages.children.length;
    let currentIndex = 0;
    let intervalId;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Agregar botones de navegación
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    prevButton.className = 'carousel-button prev';
    nextButton.className = 'carousel-button next';
    prevButton.innerHTML = '❮';
    nextButton.innerHTML = '❯';
    carouselContainer.appendChild(prevButton);
    carouselContainer.appendChild(nextButton);

    function moveCarousel(direction = 1) {
        currentIndex = (currentIndex + direction + totalImages) % totalImages;
        updateCarousel();
    }

    function updateCarousel() {
        carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;
        carouselImages.style.transition = 'transform 0.5s ease-in-out';
    }

    function startCarousel() {
        stopCarousel();
        intervalId = setInterval(() => moveCarousel(1), 3000);
    }

    function stopCarousel() {
        clearInterval(intervalId);
    }

    // Eventos para los botones
    prevButton.addEventListener('click', () => {
        stopCarousel();
        moveCarousel(-1);
        startCarousel();
    });

    nextButton.addEventListener('click', () => {
        stopCarousel();
        moveCarousel(1);
        startCarousel();
    });

    // Eventos táctiles y de mouse
    carouselImages.addEventListener('mousedown', dragStart);
    carouselImages.addEventListener('touchstart', dragStart);
    carouselImages.addEventListener('mouseup', dragEnd);
    carouselImages.addEventListener('touchend', dragEnd);
    carouselImages.addEventListener('mousemove', drag);
    carouselImages.addEventListener('touchmove', drag);
    carouselImages.addEventListener('mouseleave', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        stopCarousel();
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentPosition - startPos;
        const move = (diff / carouselContainer.offsetWidth) * 100;
        currentTranslate = prevTranslate + move;
        carouselImages.style.transform = `translateX(${-currentIndex * 100 + move}%)`;
        carouselImages.style.transition = 'none';
    }

    function dragEnd() {
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        
        if (Math.abs(movedBy) > 20) {
            currentIndex = movedBy > 0 ? 
                Math.max(currentIndex - 1, 0) : 
                Math.min(currentIndex + 1, totalImages - 1);
        }
        
        updateCarousel();
        startCarousel();
    }

    // Eventos para pausar/reanudar en hover
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);

    // Iniciar el carrusel
    startCarousel();
});

//Contacto y Reserva
function contactar(producto) {
    const mensaje = `Hola, estoy interesado en el producto: ${producto}. ¿Podrían darme más información?`;
    window.location.href = `mailto:contacto@tu-sitio.com?subject=Consulta&body=${encodeURIComponent(mensaje)}`;
  }
  
  function reservar(productoId) {
    alert(`Reserva enviada para el producto con ID: ${productoId}`);
  }

//  Fav toggle
const favoritos = new Set();

function toggleFavorite(productoId) {
  const icon = document.getElementById(`favorite-${productoId}`);
  if (favoritos.has(productoId)) {
    favoritos.delete(productoId);
    icon.textContent = '🤍'; // Corazón vacío
  } else {
    favoritos.add(productoId);
    icon.textContent = '❤️'; // Corazón lleno
  }
  console.log('Favoritos actuales:', Array.from(favoritos));
}