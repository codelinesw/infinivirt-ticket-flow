Actúa como un Diseñador Web Senior y Lead UI/UX Frontend Architect con experiencia avanzada en SaaS B2B de gestión de tickets/helpdesk. Tu objetivo es diseñar e implementar la interfaz completa de usuario en React.js con TypeScript, Vite, Tailwind CSS y Lucide-React.

El frontend debe alinearse ESTRICTAMENTE a la arquitectura de un backend previamente construido en Node.js, Express, Prisma y PostgreSQL/MySQL con autenticación JWT y RBAC (ADMIN, AGENT, SUPERVISOR, CLIENT).

---

### 1. ARQUITECTURA TÉCNICA Y ESTÁNDARES

* Stack: React (Functional Components + Hooks), TypeScript (tipado estricto), Vite, Tailwind CSS, Lucide-React.
* Estilo Visual: Dashboard SaaS profesional (Slate/Indigo), bordes `rounded-xl`, sombras finas, estados de hover/focus claros, modales limpios y tablas interactivas.
* Seguridad & RBAC: Los componentes deben reaccionar al rol del usuario decodificado desde el JWT (`req.user = { id, email, role, clientId }`).
* Layouts:
  - Auth Layout: Centrado, sin Header ni Sidebar.
  - App Layout: Con Header, Sidebar colapsable y Footer persistentes.

---

### 2. COMPONENTES GLOBALES Y REGLAS DE UI

* Header:
  - Izquierda: Logo "TicketFlow", indicador de entorno y toggle de sidebar.
  - Derecha: 
    1. Notificaciones: Icono de campana con badge de no leídos + dropdown interactivo (`useState`).
    2. Avatar: Estilo Google (círculo con color según hash del nombre e iniciales), nombre del usuario, badge del rol (`ADMIN`, `AGENT`, etc.) + dropdown desplegable con "Mi cuenta", "Configuración" y "Cerrar sesión" (highlight rojo).
* Sidebar:
  - Menú según rol:
    * CLIENT: Dashboard, Mis Casos, Centro de Ayuda.
    * AGENT / SUPERVISOR / ADMIN: Dashboard, Todos los Casos, Asignaciones, Clientes/Tenants, Centro de Ayuda, Reportes.
  - Botón inferior para expandir/colapsar el sidebar y botón de "Soporte Directo".
* Footer: Copyright, versión `v1.0.0` y estado de conexión a la API.

---

### 3. REQUISITOS DE VISTAS ALINEADAS AL BACKEND

1. Autenticación (`SignIn.tsx`, `SignUp.tsx`):
   - Campos: Email, Password, selección simulada de Tenant/Cliente (para SignUp).
   - Manejo de respuestas JWT y almacenamiento en localStorage/state.

2. Dashboard (`Dashboard.tsx`):
   - KPIs: Total de tickets, Abiertos (`OPEN`), En Progreso (`IN_PROGRESS`), Resueltos (`RESOLVED`), Cerrados (`CLOSED`).
   - Métricas visuales de SLA e historial reciente de actividad.

3. Gestión de Tickets (`MyCases.tsx` / `TicketList.tsx`):
   - Tabla interactiva con búsqueda en tiempo real (debounce) enviando la query `search` (para `title` y `description`).
   - Filtros por `status`, `priority` y paginación server-side (`page`, `limit`, `totalPages`, `total`).
   - Restricción visual: Si el usuario es `CLIENT`, solo ve sus tickets asociados a `clientId`.

4. Detalle de Ticket y Notas Internas (`TicketDetail.tsx`):
   - Cambiar estado (`PATCH /:id/status`) restringido visualmente según RBAC (`ADMIN`, `AGENT`, `SUPERVISOR`).
   - Asignar agente (`PATCH /:id/assign`) disponible únicamente para `ADMIN`.
   - Hilo de Comentarios:
     * Checkbox `¿Es nota interna? (isInternal)` visible SOLO para `ADMIN`, `AGENT` y `SUPERVISOR`.
     * Las notas internas deben mostrarse con un badge amarrillo/alerta `"NOTA INTERNA"` y ocultarse totalmente si la vista la renderiza un `CLIENT`.

5. Centro de Ayuda (`HelpCenter.tsx`) y Perfil de Usuario (`UserProfile.tsx`).

---

### METODOLOGÍA DE ENTREGAS POR BLOQUES

Para asegurar que todo el código sea completo y modular, trabajaremos paso a paso. NO me entregues todo de una sola vez.

Inicia AHORA MISMO ÚNICAMENTE con el BLOQUE 1 y detente a esperar mi confirmación:

#### BLOQUE 1: Tipos TypeScript, Configuración Base y Componentes Globales
1. Archivo `types.ts` con las interfaces completas de Ticket, User, Comment, Role (`ADMIN` | `AGENT` | `SUPERVISOR` | `CLIENT`), Status, Priority y respuestas paginadas.
2. Componentes globales: `Avatar.tsx`, `Header.tsx` (con dropdowns de notificaciones y usuario), `Sidebar.tsx` (con control de roles y colapso) y `Footer.tsx`.
3. Contenedores de layout: `AppLayout.tsx` y `AuthLayout.tsx`.
