-- Primera Forma Normal (1NF):
-- ✓ Cumple con 1NF porque:
-- - Todas las tablas tienen una clave primaria
-- - No hay grupos repetitivos
-- - Todos los atributos son atómicos (no hay valores múltiples en una columna)

-- Segunda Forma Normal (2NF):
-- ✓ Cumple con 2NF porque:
-- - Ya cumple 1NF
-- - Todos los atributos no clave dependen completamente de la clave primaria
-- - Las tablas como propiedad_caracteristicas manejan correctamente las relaciones N:M

-- Tercera Forma Normal (3NF):
-- ✓ Cumple con 3NF porque:
-- - Ya cumple 2NF
-- - No hay dependencias transitivas
-- - Los datos están correctamente separados en tablas relacionadas:
--   * Direcciones separadas de Propiedades
--   * Características separadas y relacionadas via tabla pivot
--   * Usuarios separados por roles pero en misma tabla (válido por ser tipos fijos)
DROP DATABASE IF EXISTS inmobiliaria_db;
CREATE DATABASE inmobiliaria_db;
USE inmobiliaria_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    tipo ENUM('cliente','agente','admin') DEFAULT 'cliente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE direcciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calle VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    piso VARCHAR(10),
    departamento VARCHAR(10),
    codigo_postal VARCHAR(10) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL DEFAULT 'Argentina',
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE caracteristicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria ENUM('general','servicios','comodidades','seguridad'),
    icono VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE propiedades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('casa','departamento','terreno','oficina','local','garage') NOT NULL,
    precio DECIMAL(12,2) NOT NULL,
    moneda ENUM('ARS','USD') DEFAULT 'USD',
    ambientes INT,
    dormitorios INT,
    baños INT,
    orientacion ENUM('norte','sur','este','oeste'),
    estado ENUM('disponible','reservada','vendida','alquilada') DEFAULT 'disponible',
    direccion_id INT,
    propietario_id INT NOT NULL,
    agente_id INT NOT NULL,
    FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE CASCADE,
    FOREIGN KEY (propietario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (agente_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE propiedad_caracteristicas (
    propiedad_id INT,
    caracteristica_id INT,
    valor VARCHAR(100),
    PRIMARY KEY (propiedad_id, caracteristica_id),
    FOREIGN KEY (propiedad_id) REFERENCES propiedades(id) ON DELETE CASCADE,
    FOREIGN KEY (caracteristica_id) REFERENCES caracteristicas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propiedad_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255),
    orden INT DEFAULT 0,
    es_principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (propiedad_id) REFERENCES propiedades(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE visitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propiedad_id INT NOT NULL,
    cliente_id INT NOT NULL,
    agente_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    estado ENUM('pendiente','confirmada','cancelada','realizada') DEFAULT 'pendiente',
    FOREIGN KEY (propiedad_id) REFERENCES propiedades(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (agente_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;