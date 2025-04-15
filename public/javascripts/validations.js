// Validaciones generales
const validateField = (field, minLength, message) => {
    if (!field.value.trim()) {
        field.classList.add('is-invalid');
        field.nextElementSibling.textContent = `El campo ${message} es obligatorio`;
        return false;
    }
    if (field.value.length < minLength) {
        field.classList.add('is-invalid');
        field.nextElementSibling.textContent = `El campo ${message} debe tener al menos ${minLength} caracteres`;
        return false;
    }
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    return true;
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        email.classList.add('is-invalid');
        email.nextElementSibling.textContent = 'El email es obligatorio';
        return false;
    }
    if (!emailRegex.test(email.value)) {
        email.classList.add('is-invalid');
        email.nextElementSibling.textContent = 'Ingrese un email válido';
        return false;
    }
    email.classList.remove('is-invalid');
    email.classList.add('is-valid');
    return true;
};

const validatePassword = (password, isRegister = false) => {
    if (!password.value) {
        password.classList.add('is-invalid');
        password.nextElementSibling.textContent = 'La contraseña es obligatoria';
        return false;
    }
    
    if (isRegister) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password.value)) {
            password.classList.add('is-invalid');
            password.nextElementSibling.textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
            return false;
        }
    }
    
    password.classList.remove('is-invalid');
    password.classList.add('is-valid');
    return true;
};

const validateImage = (fileInput) => {
    if (!fileInput.files || !fileInput.files[0]) return true; // No es obligatorio
    
    const file = fileInput.files[0];
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (!validTypes.includes(file.type)) {
        fileInput.classList.add('is-invalid');
        fileInput.nextElementSibling.textContent = 'Solo se permiten imágenes JPG, JPEG, PNG o GIF';
        return false;
    }
    
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        fileInput.classList.add('is-invalid');
        fileInput.nextElementSibling.textContent = 'La imagen no debe superar los 2MB';
        return false;
    }
    
    fileInput.classList.remove('is-invalid');
    fileInput.classList.add('is-valid');
    return true;
};

// Validación del formulario de registro
const validateRegisterForm = (form) => {
    const nombre = form.querySelector('#nombre');
    const apellido = form.querySelector('#apellido');
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');
    const image = form.querySelector('#image');
    
    const isValidNombre = validateField(nombre, 2, 'nombre');
    const isValidApellido = validateField(apellido, 2, 'apellido');
    const isValidEmail = validateEmail(email);
    const isValidPassword = validatePassword(password, true);
    const isValidImage = validateImage(image);
    
    return isValidNombre && isValidApellido && isValidEmail && isValidPassword && isValidImage;
};

// Validación del formulario de login
const validateLoginForm = (form) => {
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');
    
    const isValidEmail = validateEmail(email);
    const isValidPassword = validatePassword(password);
    
    return isValidEmail && isValidPassword;
};

// Validación del formulario de propiedades
const validatePropertyForm = (form) => {
    const titulo = form.querySelector('#titulo');
    const descripcion = form.querySelector('#descripcion');
    const foto = form.querySelector('#foto');
    
    const isValidTitulo = validateField(titulo, 5, 'título');
    const isValidDescripcion = validateField(descripcion, 20, 'descripción');
    const isValidFoto = validateImage(foto);
    
    return isValidTitulo && isValidDescripcion && isValidFoto;
}; 