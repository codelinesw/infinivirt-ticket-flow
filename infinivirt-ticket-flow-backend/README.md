# 🚀 Backend Service API (Node.js + Clean Architecture)

Este proyecto es una API RESTful robusta, escalable y segura desarrollada con **Node.js (v22.19.0)**, aplicando principios de **Clean Architecture (Arquitectura Limpia)**, **Prisma ORM** para la gestión de base de datos y **Zod** para la validación estricta de esquemas de entrada.

---

## 🛠️ Tecnologías y Herramientas

- **Entorno de Ejecución:** Node.js v22.19.0 LTS
- **Lenguaje:** TypeScript / JavaScript (ESNext)
- **Base de Datos & ORM:** MariaDB / MySQL + Prisma ORM
- **Autenticación & Seguridad:** 
  - JWT (JSON Web Tokens)
  - Cookies Seguras (`HttpOnly`, `SameSite`, `Secure`)
  - Soporte para `Authorization: Bearer <token>` (Mobile & Integraciones de terceros)
  - CORS Policy
  - Rate Limiting (Prevención de ataques DoS / Brute force)
- **Validación de Datos:** Zod + Middleware `validateRequest`
- **Manejo de Errores:** Middleware global `errorHandler` con respuestas estandarizadas.
- **Documentación:** Swagger UI (`/api-docs`)

---

## 🛠️ Stack Tecnológico y Librerías

### 📦 Dependencias Core (`dependencies`)
- **Framework Web:** `express` (^5.2.1)
- **Base de Datos & ORM:** `@prisma/client` (6.4.0)
- **Seguridad y Autenticación:**
  - `jsonwebtoken` (^9.0.3) - Generación y verificación de tokens JWT.
  - `bcryptjs` (^3.0.3) - Hashing seguro de contraseñas.
  - `cookie-parser` (^1.4.7) - Manejo de cookies HttpOnly seguras.
  - `helmet` (^8.3.0) - Cabeceras de seguridad HTTP.
  - `cors` (^2.8.6) - Control de acceso de origen cruzado (CORS Policy).
  - `express-rate-limit` (^8.7.0) - Prevención de abusos y ataques por fuerza bruta / DoS.
- **Validación:** `zod` (^4.6.1) - Validación e inferencia estricta de esquemas de datos.
- **Caché & Logs:**
  - `node-cache` (^5.1.2) - Almacenamiento en caché en memoria para alto rendimiento.
  - `morgan` (^1.12.0) - HTTP Request Logger.
  - `dotenv` (^17.4.2) - Carga de variables de entorno.
- **Documentación:**
  - `swagger-ui-express` (^5.0.1) & `swagger-jsdoc` (^6.3.0) - Interfaz de documentación OpenAPI/Swagger.

### 🛠️ Herramientas de Desarrollo (`devDependencies`)
- **TypeScript & Tipos:** `typescript` (^7.0.2), `@types/node` (^22.20.2), `@types/express`, `@types/jsonwebtoken`, etc.
- **ORM CLI:** `prisma` (6.4.0).
- **Ejecución y Hot Reload:** `tsx` (^4.23.13), `ts-node-dev` (^2.0.0), `ts-node`.

---

## 🏗️ Arquitectura del Proyecto (Clean Architecture)

El proyecto sigue una separación estricta de responsabilidades en capas concéntricas, garantizando independencia de frameworks y alta testeabilidad:

```
                      +----------------------------------+
                      |       Infrastructure Layer       |
                      |  (HTTP, Express, Prisma, Redis)  |
                      +----------------+-----------------+
                                       |
                                       v
                      +----------------------------------+
                      |          Services Layer          |
                      |        (Casos de Negocio)        |
                      +----------------+-----------------+
                                       |
                                       v
                      +----------------------------------+
                      |            Core Layer            |
                      |  (Entities, DTOs, Interfaces)    |
                      +----------------+-----------------+
```

### 🧩 Diagrama de Flujo de una Solicitud (Request Lifecycle)

```
 Client (Web / Mobile)
        │
        ├─── [Cookie segura HttpOnly O Header Bearer Token]
        │
        v
 ┌─────────────────────────────────────────────────────────────┐
 │ INFRASTRUCTURE / HTTP                                       │
 │                                                             │
 │  1. Rate Limiting Middleware  ─────► (Bloquea si excede)    │
 │  2. CORS Policy Middleware                                  │
 │  3. Authenticate Middleware   ─────► (Valida Cookie / Bearer)│
 │  4. Zod Validate Request      ─────► (Valida Body/Params)   │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                v
 ┌─────────────────────────────────────────────────────────────┐
 │ CONTROLLERS (Mapea req/res y llama a Services)               │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                v
 ┌─────────────────────────────────────────────────────────────┐
 │ SERVICES (Reglas de Negocio / Casos de Uso)                 │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                v
 ┌─────────────────────────────────────────────────────────────┐
 │ CORE / REPOSITORIES (Interfaces)                            │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                v
 ┌─────────────────────────────────────────────────────────────┐
 │ INFRASTRUCTURE / REPOSITORIES (Implementación con Prisma)   │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                v
                        🗄️ Database (SQL)

  * Nota: Si ocurre algún error en cualquier punto del flujo, es capturado 
    automáticamente y canalizado por el errorHandler global.
```

---

## 📂 Estructura de Carpetas

```
.
├── agents/                           # Agentes / scripts auxiliares
├── prisma/                           # Esquema de Prisma y seeds principales
│   ├── auth.seed.ts                  # Datos iniciales para roles/usuarios
│   └── schema.prisma                 # Definición de modelos y base de datos
└── src/
    ├── config/                       # Configuraciones globales
    │   └── swagger/                  # Configuración de OpenAPI / Swagger
    ├── controllers/                  # Controladores HTTP
    │   └── swagger/                  # Anotaciones/docs Swagger de controladores
    ├── core/                         # Capa de Dominio (Reglas puras del sistema)
    │   ├── DTOs/                     # Data Transfer Objects
    │   ├── entities/                 # Entidades de dominio
    │   ├── errors/                   # Clases personalizadas de error
    │   └── interfaces/               # Contratos de repositorios y servicios
    │       └── repositories/
    ├── services/                     # Lógica de negocio (Casos de uso)
    │   └── swagger/                  # Schemas/Docs Swagger de servicios
    └── infrastructure/               # Implementaciones de infraestructura externa
        ├── database/
        │   └── prisma/
        │       └── PrismaClient.ts   # Instancia singleton de Prisma Client
        ├── repositories/             # Implementación real de interfaces de repositorio
        └── http/
            ├── cache/                # Manejo de almacenamiento en caché
            ├── middlewares/          # Authenticate, errorHandler, RateLimiter, etc.
            ├── routes/               # Definición de rutas Express
            ├── validators/           # Esquemas de validación Zod
            └── security/
                └── jwt.service.ts    # Generación y verificación de tokens
```

---

## 🔒 Seguridad y Autenticación

El sistema implementa **Estrategia Dual de Autenticación**:

1. **Clientes Web (Browsers):** Se autentican leyendo una cookie segura enviada automáticamente en cada petición:
   - `HttpOnly`: Impide acceso desde JavaScript (`XSS protection`).
   - `Secure`: Solo se envía bajo HTTPS.
   - `SameSite`: Protege contra ataques CSRF.
2. **Aplicaciones Móviles e Integraciones Externas:** Se autentican mediante el encabezado estándar HTTP:
   - `Authorization: Bearer <TOKEN_JWT>`

El middleware `authenticate` inspecciona primero la cookie; si no existe, busca la cabecera `Authorization`. Si ninguno provee un JWT válido, se rechaza la solicitud con un código HTTP `401 Unauthorized`.

---

## 🛡️ Manejo Unificado de Errores y Validaciones

### Validaciones con Zod (`validateRequest`)
Todas las entradas de las peticiones (`body`, `query`, `params`) son validadas por esquemas declarativos en Zod. Si la validación falla, se retorna un error estandarizado `400 Bad Request` antes de alcanzar el controlador.

### Formato Único de Respuesta de Error (`errorHandler`)
Todos los errores de la aplicación (excepciones de Prisma, errores de validación, JWT expirado o errores de negocio) son interceptados por el `errorHandler` global, devolviendo una estructura JSON uniforme:

```json
{
  "success": false,
  "status": 400,
  "message": "Mensaje descriptivo del error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address format"
    }
  ],
  "timestamp": "2026-09-11T18:14:39.000Z"
}
```

---

## 🚀 Requisitos Previos e Instalación

### 1. Requisitos
- **Node.js:** Versión `v22.19.0` (LTS recomendada). Se recomienda usar **nvm**:
  ```bash
  nvm install 22.19.0
  nvm use 22.19.0
  ```
- **Gestor de Paquetes:** `npm` (v10+), `pnpm` o `yarn`.
- **Base de Datos:** Instancia de PostgreSQL / MySQL configurada.

### 2. Instalación de Dependencias

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio

# Iniciar Node.js en la versión adecuada
nvm use 22.19.0

# Iniciar e instalar dependencias
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el siguiente modelo:

```env
# App Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (Prisma)
DATABASE_URL="mysql://root:@localhost:3306/infinivirt_ticket_flow_db_dev"

# JWT Configuration
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=1d

# Security / CORS
CORS_ORIGIN=http://localhost:5173
COOKIE_SECRET=tu_clave_para_cookies

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000 # 15 minutos
RATE_LIMIT_MAX=100          # Máximo de solicitudes por IP
```

### 4. Configurar Base de Datos con Prisma

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar las migraciones
npx prisma migrate dev

# (Opcional) Ejecutar Seeds para poblar datos iniciales
npx prisma db seed
```

---

## 🏃‍♂️ Ejecución del Proyecto

```bash
# Modo Desarrollo (Con live reload)
npm run dev

# Compilar para Producción
npm run build

# Iniciar en Producción
npm start
```

---

## 📖 Documentación Interactiva de la API (Swagger)

Una vez iniciada la aplicación, puedes acceder a la interfaz gráfica de Swagger para explorar y probar los endpoints:

👉 **URL de Swagger:** `http://localhost:3000/api-docs`

---

## 🧪 Pruebas e Integración con Postman

En la raíz del proyecto encontrarás la colección oficial para probar los endpoints:
- Archivo: `Postman_Collection.json` (Importar directamente en Postman para probar los endpoints web y móvil).
