const theme = document.getElementById("theme");
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
