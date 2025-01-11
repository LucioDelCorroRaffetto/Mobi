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