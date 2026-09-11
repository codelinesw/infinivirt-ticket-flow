# 🚀 Infinivirt Ticket Flow - Enterprise System Monorepo

**Infinivirt Ticket Flow** es una plataforma integral de gestión y flujo de tickets de soporte empresarial. El proyecto está diseñado bajo una arquitectura modular desacoplada que separa un backend RESTful desarrollado en **Node.js + Express** (Clean Architecture + DDD) de un cliente web reactivo en **React 19 + Vite 8** (MVVM + Clean Architecture).

El sistema implementa patrones de diseño enterprise como **Repository Pattern**, **Singleton Orchestrator (`BaseController`)**, **CQRS simplificado / Use Cases**, autenticación stateless/stateful mediante **JWT & Cookies HttpOnly**, y validación estricta en ambas capas.

---

## 🏗️ Visión General del Sistema y Arquitectura Global

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE WEB (FRONTEND)                            │
│                                                                             │
│   [ Views / React 19 ] <───> [ Custom Hooks / ViewModels ]                  │
│                                           │                                 │
│                                           ▼                                 │
│                                [ Zustand Global State ]                     │
│                                           │                                 │
│                                           ▼                                 │
│                             [ BaseController Singleton ]                    │
│                                           │                                 │
│                                           ▼                                 │
│                                [ Axios HTTP Interceptor ]                   │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      │ HTTP / HTTPS (JSON REST API)
                                      │ Header Authorization / HttpOnly Cookies
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVIDOR API (BACKEND)                            │
│                                                                             │
│                               [ Express App ]                               │
│                                           │                                 │
│                                           ▼                                 │
│                             [ CORS & Security Helmet ]                      │
│                                           │                                 │
│                                           ▼                                 │
│                      [ Auth Middleware / JWT Verification ]                 │
│                                           │                                 │
│                                           ▼                                 │
│                              [ Controller Layer ]                           │
│                                           │                                 │
│                                           ▼                                 │
│                             [ Use Cases / Domain Layer ]                    │
│                                           │                                 │
│                                           ▼                                 │
│                        [ Repositories / MySQL/MariaDB Layer ]               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Comunicación e Integración entre Apps

### 1. Flujo de Autenticación y Gestión de Sesión
```
[ Frontend: Login View ]
       │
       ├─► Instancia DTO Request (email, password)
       ├─► Invocación vía BaseController.login()
       │      ├─► Activa Loading State Global
       │      └─► Petición POST /api/auth/login mediante Axios
       │
[ Backend: Express Server ]
       │
       ├─► AuthController recibe petición
       ├─► Invoca LoginUseCase (Verifica Hash Bcrypt & Usuario en Postgres)
       ├─► Genera JSON Web Token (JWT) firmado con expiración
       └─► Retorna Respuesta HTTP 200:
              ├─► Cookie 'token' Set-Cookie (HttpOnly, Secure, SameSite)
              └─► Payload JSON con datos del usuario y rol
       │
[ Frontend: BaseController & Zustand ]
       ├─► Desactiva Loading State
       ├─► Dispara Toast Success ("Bienvenido al sistema")
       └─► Almacena estado de usuario autenticado en Zustand Store
```

### 2. Flujo de Operaciones y Orquestación de Peticiones (`BaseController`)
```
[ Frontend: Componente UI ]
       │
       ├─► Usuario ejecuta acción (Crear Ticket, Listar Servicios, etc.)
       ├─► Hook invoca método del BaseController (Singleton)
       │      ├─► Se dispara evento de Carga (Global/Local Spinner)
       │      └─► Axios envía Request HTTP con Credenciales (withCredentials: true)
       │
[ Backend: API Pipeline ]
       │
       ├─► Router ──► Express Auth Middleware (Valida JWT en Cookie/Header)
       ├─► Controller ──► Use Case (Ejecuta regla de negocio)
       ├─► Repository ──► Prisma/SQL Queries contra Base de Datos
       └─► Responde JSON estandarizado: { success: true, data: {...}, message: "..." }
       │
[ Frontend: Manejo de Respuesta y Excepciones ]
       ├─► Axios Interceptor captura respuesta HTTP
       ├─► BaseController captura respuesta o captura Custom Exception
       ├─► Oculta Spinner de Carga
       └─► Dispara Toast interactivo vía React-Toastify (Éxito o Error)
```

---

## 📁 Estructura del Proyecto (Monorepo raíz)

```
.
├── backend/                          # App Backend (Node.js + Express + Clean Architecture)
│   ├── src/
│   │   ├── config/                   # Variables de entorno y configuración de DB/JWT
│   │   ├── controllers/              # Adaptadores de entrada (Express Controllers)
│   │   ├── domain/                   # Entidades, DTOs e interfaces del dominio
│   │   ├── middlewares/              # Autenticación, CORS, Error Handlers
│   │   ├── repositories/             # Implementaciones de acceso a datos (ORM/SQL)
│   │   ├── routes/                   # Definición de Endpoints de la API
│   │   ├── use-cases/                # Casos de uso / Lógica de negocio pura
│   │   └── app.ts                    # Punto de entrada y servidor Express
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # App Frontend (React 19 + Vite 8 + MVVM)
│   ├── src/
│   │   ├── assets/                   # Recursos estáticos
│   │   ├── core/                     # Capa de Dominio (DTOs Request/Response)
│   │   ├── data/                     # Http Client Wrapper, Repositories, Exceptions
│   │   ├── presentation/             # Views, Custom Hooks/ViewModels, Components, Zustand Stores
│   │   └── utilities/                # BaseController Singleton & Helpers
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore                        # Gitignore unificado para Monorepo
├── README.md                         # Documentación General del Sistema
└── package.json                      # Workspace Scripts para orquestar la raíz
```

---

## 🛠️ Stack Tecnológico Global

| Capa | Tecnología | Descripción / Rol |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19** | Biblioteca para interfaces de usuario reactivas |
| **Frontend Bundler** | **Vite 8** | Herramienta de compilación ultrarrápida y HMR |
| **Frontend State** | **Zustand 5** | Gestión de estado global simplificada sin boilerplate |
| **Frontend Styling**| **Tailwind CSS v4**| Framework CSS atómico de alto rendimiento |
| **Frontend HTTP** | **Axios 1.20** | Cliente HTTP con soporte de interceptores y credenciales |
| **Backend Runtime** | **Node.js (v22+)**| Entorno de ejecución JavaScript asíncrono |
| **Backend Framework**| **Express.js** | Framework web RESTful modular y ligero |
| **Lenguaje** | **TypeScript (~6.0)**| Lenguaje tipado para ambas aplicaciones |
| **Testing** | **Jest & RTL** | Suite de pruebas unitarias e integración |
| **Seguridad** | **JWT / Bcrypt** | Autenticación stateless y encriptación de contraseñas |

---

## 🚀 Requisitos e Instalación

### 1. Requisitos Previos
- **Node.js:** Versión `v22.19.0` (LTS recomendada).
- **Gestor de paquetes:** `npm` v10+.
- **Motor de Base de Datos:** Mysql/Mariadb

### 2. Instalación General

Clona el repositorio e instala las dependencias de ambos proyectos:

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/infinivirt-ticket-flow.git
cd infinivirt-ticket-flow

# Instalar dependencias del Backend
cd backend
npm install

# Instalar dependencias del Frontend
cd ../frontend
npm install
```

---

## ⚙️ Configuración de Variables de Entorno (`.env`)

### 1. Backend (`backend/.env`)
```env
PORT=3000
NODE_ENV=development

# Base de Datos
DATABASE_URL="mysql://root:@localhost:3306/infinivirt_ticket_flow_db_dev"

# Autenticación JWT
JWT_SECRET=tu_clave_secreta_super_segura_jwt
JWT_EXPIRES_IN=8h

# Configuración CORS & Cookies
FRONTEND_URL=http://localhost:5173
COOKIE_DOMAIN=localhost
```

### 2. Frontend (`frontend/.env`)
```env
# URL Base de la API REST
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
```

---

## 🏃‍♂️ Comandos y Scripts de Ejecución

Puedes ejecutar ambas aplicaciones simultáneamente o de forma individual desde sus respectivas carpetas:

### Running Backend (Servidor API)
```bash
cd backend
npm run dev      # Inicia el backend en modo desarrollo con reload
npm run build    # Compila TypeScript a JavaScript
npm start        # Inicia el backend compilado en producción
```

### Running Frontend (Cliente Web)
```bash
cd frontend
npm run dev      # Inicia el servidor de desarrollo Vite (http://localhost:5173)
npm run build    # Compila la app para producción (TSC + Vite Build)
npm run preview  # Previsualiza el bundle compilado de producción
npm test         # Ejecuta la suite de pruebas unitarias con Jest
```

---

## 🔒 Seguridad y Buenas Prácticas

1. **Autenticación Híbrida Segura:** Soporta envío de tokens JWT mediante cookies `HttpOnly; Secure; SameSite` para navegadores web y headers `Authorization: Bearer <token>` para clientes alternativos.
2. **Control de Errores Centralizado:** Tanto el frontend (mediante `BaseController` e Interceptores) como el backend (a través de middlewares de excepciones) estandarizan las respuestas de error sin exponer trazas sensibles en producción.
3. **Validación DTO Dual:** Las peticiones son validadas estructuralmente en el Frontend antes de enviarse y son re-validadas estrictamente en la capa de Entrada/Casos de Uso en el Backend.
