# Vitrio — Frontend

Interface web del sistema de gestión de proyectos **Vitrio**, desarrollada en React con Vite y conectada a una API REST de Django con autenticación JWT.

---

## Tecnologías utilizadas

| Tecnología | Descripción |
|---|---|
| React 18 | Librería principal de UI |
| Vite | Herramienta de desarrollo y build |
| JWT | Autenticación con tokens |
| Fetch API | Comunicación con el backend |
| LocalStorage | Almacenamiento de tokens en el navegador |

---

##  Estructura del proyecto

```
vitrio-app/
├── src/
│   └── App.jsx        # Código principal del frontend
├── public/            # Archivos estáticos
├── index.html         # Punto de entrada
├── vite.config.js     # Configuración de Vite
├── package.json       # Dependencias y scripts
└── .gitignore
```

---

##  Instalación y ejecución

### Requisitos previos
- Node.js v20 o superior
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/DavidCanon07/Vitrio-APP.git
cd Vitrio-APP

# 2. Instalar dependencias
npm install

# 3. Correr en desarrollo
npm run dev
```

Abrir en el navegador: `http://localhost:5173`

---

##  Autenticación

El sistema usa **JWT (JSON Web Token)**. Al iniciar sesión, el backend devuelve dos tokens:

- `access` — usado en cada petición HTTP (expira en 8 horas)
- `refresh` — usado para renovar el access token automáticamente (expira en 7 días)

Los tokens se guardan en `localStorage` y se envían en el header de cada petición:

```
Authorization: Bearer <token>
```

---

##  Conexión con la API

La URL base de la API se configura al inicio de `App.jsx`:

```js
const API_BASE = "https://presymphonic-nonnavigably-rhys.ngrok-free.dev";
```

Toda la comunicación con el backend pasa por la función `apiFetch()`, que agrega automáticamente el token JWT y renueva el access token si expira.

### Endpoints utilizados

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/login/` | Iniciar sesión |
| POST | `/api/token/refresh/` | Renovar token |
| GET/POST | `/api/clientes/` | Listar / Crear clientes |
| GET/PUT/DELETE | `/api/clientes/{id}/` | Ver / Editar / Eliminar cliente |
| GET/POST | `/api/usuarios/` | Listar / Crear usuarios |
| GET/POST | `/api/proyectos/` | Listar / Crear proyectos |
| GET/POST | `/api/plantillas/` | Listar / Crear plantillas |
| GET/POST | `/api/archivos/` | Listar / Crear archivos |
| GET/POST | `/api/dispositivos/` | Listar / Crear dispositivos |

---

##  Módulos del sistema

El frontend gestiona las 6 entidades del modelo entidad-relación:

-  **Clientes** — nombre, email, teléfono
-  **Usuarios** — rol, fecha de nacimiento, cliente asociado
-  **Proyectos** — nombre, descripción, estado, fechas, cliente asociado
-  **Plantillas** — nombre, tipo, versión, estado, ruta base
-  **Archivos** — nombre, tipo, ruta, proyecto y plantilla asociados
-  **Dispositivos** — nombre, ubicación, resolución, estado, proyecto asociado

---

##  Arquitectura del código

`App.jsx` está organizado en las siguientes secciones:

```
1. CONFIG        → URL base de la API
2. AUTH          → Manejo de tokens JWT
3. SCHEMAS       → Definición de campos por entidad
4. ENTITY_META   → Metadata visual de cada módulo
5. ESTADO_COLORS → Colores de badges de estado
6. LOGIN         → Pantalla de inicio de sesión
7. MODAL         → Ventana emergente reutilizable
8. FORM          → Formulario dinámico por entidad
9. TABLE         → Tabla de datos con acciones CRUD
10. DASHBOARD    → Pantalla principal con sidebar
11. ROOT         → Componente raíz (Login vs Dashboard)
```

---
##  Notas

- La URL de la API puede cambiar si ngrok se reinicia — consultar al backend.
- Para desarrollo local el backend debe estar corriendo antes de iniciar el frontend.
- El comando `npm install` regenera `node_modules` que no está incluido en el repositorio.
