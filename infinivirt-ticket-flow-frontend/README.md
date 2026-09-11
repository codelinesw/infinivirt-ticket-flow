# 🚀 Infinivirt Ticket Flow - Frontend Client

**Infinivirt Ticket Flow** es un cliente web SPA (Single Page Application) moderno, reactivo y de alto rendimiento construido con **React 19**, **TypeScript** y **Vite 8**. El proyecto implementa la arquitectura **MVVM-Clean Architecture**, desacoplando totalmente la interfaz de usuario de la lógica de negocio y las llamadas a infraestructura de red.

Cuenta con un patrón **Singleton** en su `BaseController` para la orquestación unificada de peticiones HTTP, estados de carga (*loading state*) y notificaciones de éxito/error, un wrapper optimizado con **Axios e interceptores**, gestión de estado global con **Zustand**, estilizado atómico con **Tailwind CSS v4** y un conjunto completo de pruebas unitarias con **Jest + Testing Library**.

---

## 🛠️ Stack Tecnológico y Dependencias

### 📦 Dependencias Core (`dependencies`)
- **Core UI & Runtime:** `react` (^19.2.8), `react-dom` (^19.2.8)
- **Herramienta de Construcción (Bundler):** `vite` (^8.2.2) + `@vitejs/plugin-react`
- **Enrutamiento:** `react-router-dom` (^7.18.3)
- **Gestión de Estado Global:** `zustand` (^5.0.15)
- **Formularios y Validación:** `react-hook-form` (^7.87.0)
- **Cliente HTTP:** `axios` (^1.20.0)
- **Notificaciones & UI Feedback:** `react-toastify` (^11.1.0)
- **Iconografía:** `lucide-react` (^1.43.0)
- **Estilizado & Motores CSS:** `tailwindcss` (^4.3.3) & `@tailwindcss/vite` (^4.3.3)

### 🛠️ Herramientas de Desarrollo y Testing (`devDependencies`)
- **Lenguaje & Tipado:** `typescript` (~6.0.2), `@types/react`, `@types/node`
- **Testing Unitario / Integración:** `jest` (^30.5.1), `@testing-library/react` (^16.3.3), `@testing-library/jest-dom` (^7.0.1), `jest-environment-jsdom`, `babel-jest`
- **Linter & Calidad de Código:** `eslint` (^10.9.0), `eslint-plugin-react-hooks`, `typescript-eslint`

---

## 🏗️ Arquitectura (MVVM + Clean Architecture)

El proyecto fusiona **Clean Architecture** (separación estricta en Dominio, Datos y Presentación) con el patrón **MVVM (Model-View-ViewModel)** adaptado a React mediante *Custom Hooks* y *Base Controllers*:

```
 +-----------------------------------------------------------------------+
 |                         PRESENTATION LAYER                            |
 |  [ Views / Screens ]  <--->  [ Custom Hooks / ViewModels ]            |
 |         │                            │                                |
 |         ▼                            ▼                                |
 |  [ React Components ]     [ Zustand Global State ]                    |
 +--------------------------------------+--------------------------------+
                                        │
                                        v
 +-----------------------------------------------------------------------+
 |                           UTILITIES / BASE                            |
 |                 [ BaseController (Singleton) ]                        |
 |       (Orquesta: Loading Spinner + Toast Notifications + Axios)       |
 +--------------------------------------+--------------------------------+
                                        │
                                        v
 +-----------------------------------------------------------------------+
 |                              DATA LAYER                               |
 |       [ Remote Repositories ] <---> [ Axios HTTP Wrapper ]            |
 +--------------------------------------+--------------------------------+
                                        │
                                        v
 +-----------------------------------------------------------------------+
 |                              CORE LAYER                               |
 |                      [ DTOs: Request / Response ]                     |
 +-----------------------------------------------------------------------+
```

---

## 🧩 Diagrama de Flujo de una Petición (BaseController & Axios Lifecycle)

El patron **Singleton** en `BaseController` encapsula todo el ciclo de vida de una llamada a la API: activa el estado de carga global/local, procesa la respuesta mediante la capa `data/http`, captura interceptores y muestra notificaciones visuales (`react-toastify`):

```
 View / Component (e.g., LoginView)
        │
        ▼ (Llama acción del Hook/ViewModel)
 Custom Hook / UseCase (e.g., useAuth)
        │
        ▼ (Invoca el método orquestado)
 BaseController (Singleton)
        │
        ├─── 1. Activa Estado Loading (e.g., setLoading(true))
        │
        ├─── 2. Ejecuta la petición vía Data Repository / Axios Wrapper
        │          │
        │          ├──► Axios Request Interceptor (Adjunta headers / credenciales)
        │          ├──► API REST / Backend Node.js
        │          └──► Axios Response Interceptor (Mapea / Transforma la respuesta DTO)
        │
        ├─── 3. Si es Exitoso (Success):
        │          ├──► Oculta Loading
        │          ├──► Muestra Toast de Éxito (react-toastify)
        │          └──► Retorna Response DTO al Hook / Zustand Storage
        │
        └─── 4. Si Ocurre un Error (Exception):
                   ├──► Oculta Loading
                   ├──► Captura Custom Exception (Data / Exceptions)
                   └──► Muestra Toast de Error estandarizado
```

---

## 📂 Estructura de Carpetas

```
src/
├── assets/                           # Archivos estáticos (imágenes, SVGs, fuentes, etc.)
├── core/                             # Capa de Dominio (Reglas de negocio puro e interfaces)
│   └── DTOs/                         # Data Transfer Objects
│       ├── Request/                  # DTOs para payload de peticiones HTTP (Body/Params)
│       └── Response/                 # DTOs para respuestas del Backend
├── data/                             # Capa de Infraestructura y Datos (Local/Remoto)
│   ├── exceptions/                   # Manejo de excepciones y errores personalizados
│   ├── repositories/                 # Implementación real de repositorios de datos
│   │   └── remote/                   # Repositorios remotos que interactúan con APIs externas
│   └── http/                         # Wrapper de Axios, configuraciones e interceptores
├── presentation/                     # Capa de Presentación (Interfaz de Usuario & MVVM)
│   ├── components/                   # Componentes UI reutilizables (Inputs, Buttons, Cards)
│   ├── context/                      # React Contexts para estados locales compartidos
│   ├── hooks/                        # Custom Hooks (ViewModels para conectar vistas con controladores)
│   ├── layouts/                      # Wrappers de estructura visual, guards y render condicional
│   ├── storage/                      # Estado global con Zustand (Auth, Tickets, Settings)
│   └── views/                        # Pantallas / Páginas principales de la aplicación
└── utilities/                        # Código auxiliar reutilizable
    ├── base/                         # BaseController Singleton (Loading, Toasts, API Wrapper)
    └── helpers/                      # Funciones helper puras (formateadores, validadores)
```

---

## 🔒 Manejo Centralizado de Peticiones y HTTP

### `BaseController` (Singleton)
Garantiza que la lógica para mostrar cargadores de pantalla, lanzar toasters (`react-toastify`) y capturar excepciones de red no se duplique en cada componente.

### Axios Wrapper e Interceptores (`data/http`)
- **Credentials:** Configurado con `withCredentials: true` para enviar automáticamente las cookies seguras `HttpOnly` emitidas por el backend.
- **Header Fallback:** Capaz de incluir el encabezado `Authorization: Bearer <token>` cuando la petición proviene de clientes sin soporte de cookies automáticas.
- **Interceptores de Respuesta:** Desempaquetan la estructura unificada de error devuelta por el servidor e instancian las excepciones en `data/exceptions`.

---

## 🚀 Requisitos e Instalación

### 1. Requisitos Previos
- **Node.js:** Versión `v22.19.0` (LTS recomendada).
- **Gestor de Paquetes:** `npm` (v10+).

### 2. Pasos para la Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/infinivirt-ticket-flow-frontend.git
cd infinivirt-ticket-flow-frontend

# Asegurar la versión adecuada de Node.js
nvm use 22.19.0

# Instalar dependencias
npm install
```

### 3. Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto:

```env
# URL Base de la API REST Backend
VITE_API_BASE_URL=http://localhost:3000/api

# Tiempo de espera para peticiones HTTP (ms)
VITE_API_TIMEOUT=10000
```

---

## 🏃‍♂️ Scripts Disponibles

```bash
# Iniciar servidor de desarrollo con Vite
npm run dev

# Compilar proyecto para producción (Verificación de tipos con tsc + bundle con Vite)
npm run build

# Vista previa de la build de producción localmente
npm run preview

# Ejecutar el linter para calidad de código (ESLint)
npm run lint

# Ejecutar pruebas unitarias e integración con Jest
npm test
```

---

## 🧪 Pruebas Unitarias y de Integración

El proyecto cuenta con una suite de pruebas configurada con **Jest** y **React Testing Library**:

```bash
# Ejecutar pruebas
npm test

# Ejecutar pruebas en modo watch
npm test -- --watch
```
