-- ============================================================
-- BASE DE DATOS: Vitrio
-- ============================================================

CREATE DATABASE IF NOT EXISTS Vitrio;
USE Vitrio;

-- ============================================================
-- TABLA: cliente
-- Información del negocio (restaurante, tienda, etc.)
-- ============================================================

CREATE TABLE IF NOT EXISTS cliente (
    id_cliente          INT AUTO_INCREMENT PRIMARY KEY,
    nombre              VARCHAR(200)    NOT NULL,
    email               VARCHAR(200)    NOT NULL UNIQUE,
    telefono            VARCHAR(20)     NOT NULL,
    fecha_creacion      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: usuario
-- Todos los usuarios del sistema (Vitrio + clientes)
-- ============================================================

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario          INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente          INT             NULL,     -- NULL si es admin interno de Vitrio
    fecha_nacimiento    DATE,

    rol ENUM (
        'ADMINISTRADOR',            -- interno Vitrio, control total
        'ADMINISTRADOR_CLIENTE',    -- gestiona su negocio
        'CLIENTE'                   -- acceso limitado
    ) NOT NULL,

    fecha_creacion      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_usuario_cliente (id_cliente)
);

-- ============================================================
-- TABLA: credencial
-- Login de todos los usuarios del sistema
-- ============================================================

CREATE TABLE IF NOT EXISTS credencial (
    id_credencial       INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario          INT             NOT NULL UNIQUE,
    nombre              VARCHAR(200)    NOT NULL,
    contrasena          VARCHAR(255)    NOT NULL,
    email               VARCHAR(200)    NOT NULL UNIQUE,
    fecha_creacion      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_credencial_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_credencial_usuario (id_usuario)
);

-- ============================================================
-- TABLA: proyecto
-- Campaña o conjunto de contenido de un cliente
-- ============================================================

CREATE TABLE IF NOT EXISTS proyecto (
    id_proyecto         INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente          INT             NOT NULL,
    nombre              VARCHAR(200)    NOT NULL,
    descripcion         TEXT            NOT NULL,
    fecha_inicio        DATE            NOT NULL,
    fecha_entrega       DATE            NOT NULL,

    estado ENUM (
        'PROPUESTO',
        'ANALISIS',
        'APROBADO',
        'PLANIFICACION',
        'EJECUCION',
        'SEGUIMIENTO',
        'PAUSADO',
        'CANCELADO',
        'COMPLETADO',
        'CERRADO'
    ) NOT NULL DEFAULT 'PROPUESTO',

    fecha_creacion      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_proyecto_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_proyecto_cliente (id_cliente)
);

-- ============================================================
-- TABLA: plantilla
-- Layouts prediseñados para mostrar en pantalla
-- ============================================================

CREATE TABLE IF NOT EXISTS plantilla (
    id_plantilla        INT AUTO_INCREMENT PRIMARY KEY,
    nombre              VARCHAR(200)    NOT NULL,
    descripcion         TEXT,

    tipo ENUM (
        'VIDEO',
        'IMAGEN',
        'AUDIO',
        'PAQUETE',
        'METADATO',
        'DOCUMENTO'
    ) NOT NULL,

    version             VARCHAR(50)     DEFAULT '1.0',

    estado ENUM (
        'ACTIVA',
        'INACTIVA',
        'DEPRECADA'
    ) DEFAULT 'ACTIVA',

    ruta_base           VARCHAR(500),
    fecha_creacion      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: archivo
-- Videos, imágenes y documentos que se muestran en pantalla
-- ============================================================

CREATE TABLE IF NOT EXISTS archivo (
    id_archivo          INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto         INT             NOT NULL,
    id_plantilla        INT,
    nombre              VARCHAR(200)    NOT NULL,
    ruta                VARCHAR(500)    NOT NULL,

    tipo ENUM (
        'VIDEO',
        'IMAGEN',
        'AUDIO',
        'PAQUETE',
        'METADATO',
        'DOCUMENTO'
    ) NOT NULL,

    fecha_creacion      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_archivo_proyecto
        FOREIGN KEY (id_proyecto)
        REFERENCES proyecto (id_proyecto)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_archivo_plantilla
        FOREIGN KEY (id_plantilla)
        REFERENCES plantilla (id_plantilla)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    INDEX idx_archivo_proyecto (id_proyecto),
    INDEX idx_archivo_plantilla (id_plantilla)
);

-- ============================================================
-- TABLA: dispositivo
-- Pantallas físicas asociadas a un proyecto
-- ============================================================

CREATE TABLE IF NOT EXISTS dispositivo (
    id_dispositivo      INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto         INT             NOT NULL,
    nombre              VARCHAR(200)    NOT NULL,
    ubicacion           VARCHAR(200),
    token               VARCHAR(255)    NOT NULL UNIQUE,
    resolucion          VARCHAR(50),

    estado ENUM (
        'ACTIVO',
        'INACTIVO',
        'SIN_CONEXION'
    ) DEFAULT 'ACTIVO',

    ultima_conexion     TIMESTAMP       NULL,
    fecha_creacion      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_dispositivo_proyecto
        FOREIGN KEY (id_proyecto)
        REFERENCES proyecto (id_proyecto)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_dispositivo_proyecto (id_proyecto)
);

# ============================================================
# VISTA: vista_proyecto_completo

/*

---

## Modelo final
usuario ──> cliente ──< proyecto ──< dispositivo
	│                       │
credencial                archivo
                            │
                        plantilla