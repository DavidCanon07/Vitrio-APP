# Vitrio — **Pantallas comerciales remotas y en tiempo real**

Vitrio es una plataforma web que permite a pequeñas y medianas empresas gestionar contenido en pantallas digitales de forma centralizada, sin necesidad de conocimientos técnicos.

---

## Stack Tecnológico

| Capa               | Tecnología                            |
| ------------------ | -------------------------------------- |
| Backend            | Django 5 + Django REST Framework + JWT |
| WebSockets         | Django Channels + Redis                |
| Tareas asíncronas | Celery + Redis                         |
| Frontend           | React + Vite                           |
| Base de datos      | MySQL                                  |
| Almacenamiento     | S3 / MinIO                             |

---

## Estructura del Proyecto

```
Vitrio-APP/
├── backend/               # API REST, modelos, lógica de negocio
│   ├── Vitrio/            # Configuración Django (settings, urls, wsgi)
│   ├── VitrioApp/         # Modelos, vistas y serializers
│   ├── manage.py
│   └── db.sqlite3         # Solo desarrollo local
├── frontend/              # Interfaz de usuario React
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── vite.config.js
├── docs/                  # Documentación técnica
├── .gitignore
├── start.sh               # Script para levantar el proyecto
└── README.md
```

---

## Requisitos Previos

- Python 3.11+
- Node.js 18+
- Redis (para Channels y Celery)
- MySQL 8+

---

## Instalación y Configuración

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv env
source env/bin/activate        # Linux/Mac
env\Scripts\activate           # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de BD, Redis y S3

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Levantar servidor
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev
```

### Levantar todo con el script

```bash
chmod +x start.sh
./start.sh
```

---

## Variables de Entorno

Crear un archivo `.env` en `backend/` basado en `.env.example`:

```env
SECRET_KEY=tu_secret_key
DEBUG=True
DATABASE_URL=mysql://usuario:password@localhost:3306/vitrio
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
```

---

## Documentación

La documentación técnica detallada se encuentra en `/docs`:

- `docs/backend.pdf` — Modelos, endpoints y lógica de negocio
- `docs/frontend.pdf` — Componentes, rutas y estado

---

## Equipo

| Integrante       | Rol                                    |
| ---------------- | -------------------------------------- |
| Cañon David     | DBA - Software Architect               |
| Moreno Andrés   | Product Owner - Backend Developer      |
| Florez Diego     | Project Manager - Full Stack Developer |
| Betancurt Manuel | QA Tester - Frontend Developer         |
| Ibañez Samuel   | Security Engineer - Backend Developer  |

Universidad San Buenaventura — Bogotá

---

## Licencia

Proyecto académico. Todos los derechos reservados.
