# MindBalance — Documentación técnica

> Anexo de desarrollo técnico del TFG. Describe la arquitectura, las decisiones tomadas durante el desarrollo, las alternativas evaluadas y los problemas encontrados, junto con su justificación.

---

## 1. Visión general

**MindBalance** es una plataforma web de bienestar mental que combina:

- **Programas terapéuticos** estructurados (mindfulness, ansiedad, sueño, autoestima) con sesiones progresivas en formato vídeo + ejercicio + reflexión.
- **Biblioteca psicoeducativa** con recursos validados (artículos, audios, vídeos).
- **Comunidad** estilo feed (posts, likes, comentarios, hashtags).
- **Teleconsultas** con profesionales (reserva, gestión de citas, videollamada).
- **Seguimiento de progreso** (metas personales, XP, racha, estado de ánimo diario).
- **Asistente conversacional** (IA + base de conocimiento de respaldo).
- **Panel de administración** para gestionar usuarios y contenido.
- **Tour interactivo** automático para nuevos usuarios.

El producto se concibe como una SPA (Single Page Application) servida desde Vercel, contra una API REST desplegada en Render, con MongoDB Atlas como base de datos.

---

## 2. Arquitectura

### 2.1 Estructura del repositorio

Se ha optado por un **monorepo "ligero"** con dos paquetes independientes:

```
mindbalance/
├── backend/        Node.js + Express + TypeScript + MongoDB
│   ├── src/
│   │   ├── config/         Variables de entorno y conexión DB
│   │   ├── controllers/    Lógica de cada recurso
│   │   ├── middleware/     Autenticación JWT y comprobación de roles
│   │   ├── models/         Esquemas Mongoose
│   │   ├── routes/         Definición de rutas Express
│   │   ├── services/       Lógica reutilizable (chatFallback)
│   │   ├── index.ts        Punto de entrada del servidor
│   │   └── seed.ts         Carga de datos iniciales
│   └── tests/      Tests Jest + supertest + mongodb-memory-server
├── frontend/       React 19 + Vite + TypeScript + MUI
│   └── src/
│       ├── components/     Componentes reutilizables
│       ├── context/        AuthContext, TourContext
│       ├── hooks/          Hooks personalizados
│       ├── pages/          Rutas top-level
│       ├── services/       Clientes HTTP (api, chat)
│       ├── theme/          Sistema de diseño (tokens MUI)
│       └── __tests__/      Tests con Vitest
└── docs/           Documentación técnica
```

**Por qué un monorepo (no separados):** facilita versionar conjuntamente backend y frontend, compartir un único `git log` y mantener los contratos del API alineados. No se usa Turborepo ni Nx porque la complejidad añadida (cache distribuida, pipelines, etc.) no se justifica para dos paquetes.

**Por qué no usar un meta-framework como Next.js que aglutine todo:** queríamos demostrar el ciclo completo de un cliente y un servidor desacoplados, con dos despliegues independientes y la posibilidad de exponer la API a otros consumidores (móvil, integraciones) en el futuro. Además, separar la lógica del servidor de la del cliente sirve mejor a la docencia del TFG.

### 2.2 Diagrama lógico

```
[Cliente (browser)]
        │  HTTPS (JSON + JWT en header Authorization)
        ▼
[Frontend  (React + Vite, Vercel)]
        │  axios → /api/*
        ▼
[Backend (Express + TypeScript, Render)]
        │
        ├─► [MongoDB Atlas]    (datos persistentes)
        └─► [Google Gemini]    (IA del chatbot, opcional)
```

La capa frontend no habla nunca con la base de datos directamente: todo pasa por el backend. La key de Gemini vive únicamente en el servidor (no se expone al cliente).

### 2.3 Despliegue

- **Backend** → Render (`render.yaml` define el servicio web). Build con `tsc`, run con `node dist/index.js`.
- **Frontend** → Vercel (`vercel.json` configura redirecciones SPA y headers). Build con Vite.
- **DB** → MongoDB Atlas (cluster compartido).
- **Variables de entorno**: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`.

---

## 3. Stack tecnológico y justificación

### 3.1 Backend

| Tecnología | Versión | Razón |
|------------|---------|-------|
| Node.js | 18+ | LTS, runtime JS más extendido en el servidor, ecosistema masivo. |
| TypeScript | 5+ | Tipado estático → menos errores en runtime, mejor refactor, IDE inteligente. |
| Express | 5.x | Minimalista, maduro (10+ años), enorme cantidad de middlewares disponibles. |
| Mongoose | 8.x | ODM declarativo, validaciones a nivel de esquema, populates fáciles. |
| MongoDB | 6.x | Schemaless → flexibilidad para iterar el modelo durante el TFG. |
| jsonwebtoken | 9.x | Estándar de JWT, stateless. |
| bcryptjs | 3.x | Hash de contraseñas resistente a fuerza bruta (sin compilación nativa). |
| dotenv | 17.x | Variables de entorno desde `.env`. |
| Jest + ts-jest | 30.x | Test runner extendido, snapshot, mocks. |
| supertest | — | Testear endpoints HTTP sin levantar el servidor. |
| mongodb-memory-server | 10.x | Tests aislados sin necesidad de Docker ni mongod local. |

**Configuración TypeScript** (`tsconfig.json`):
- `module: "nodenext"` + `verbatimModuleSyntax: true` — fuerza usar `import type` explícito y extensiones `.js` en los imports relativos (alinea con el comportamiento real de Node ESM).
- `exactOptionalPropertyTypes: true` — distingue entre "propiedad ausente" y "propiedad presente con `undefined`", crucial para evitar bugs sutiles.
- `noUncheckedIndexedAccess: true` — todo acceso por índice retorna `T | undefined`.
- `strict: true` — todas las comprobaciones agresivas.

### 3.2 Frontend

| Tecnología | Versión | Razón |
|------------|---------|-------|
| React | 19 | El framework de UI más extendido; el ecosistema (MUI, react-router, react-hook-form…) lo asume. |
| Vite | 7 | Servidor de desarrollo casi instantáneo (ESM nativo), HMR rapidísimo, build con Rollup. |
| TypeScript | 5 | Tipado estático compartido con el backend. |
| Material-UI (MUI) | 7 | Sistema de diseño completo + theming + componentes accesibles listos para usar. |
| Framer Motion | 12 | Declarativo, integra perfecto con React, soporta `prefers-reduced-motion`. |
| React Router | 7 | Estándar de facto para SPA en React. |
| Axios | 1.x | Interceptores (inyección de JWT, manejo global de 401/5xx). |
| react-hook-form + yup | 7 / 1 | Validación de formularios eficiente (renders mínimos). |
| Recharts + Chart.js | 3 / 4 | Gráficas declarativas para el dashboard de progreso. |
| react-joyride | 2.9 | Tour guiado con localStorage y portales. |
| @react-three/fiber + drei | 9 / 10 | (Reserva) efectos 3D opcionales en hero. |
| Vitest + Testing Library | 2 / 16 | Tests rápidos con el mismo runner que la build (Vite). |

### 3.3 Comunicación cliente-servidor

- **REST con JSON** sobre HTTPS.
- **JWT en `Authorization: Bearer <token>`** — añadido automáticamente por un interceptor de Axios (`services/api.ts`).
- **Manejo global de errores**: los errores 401 y 5xx emiten un `CustomEvent("api:error")` que `GlobalSnackbar` escucha y traduce a un toast.
- **CORS**: configurado de forma restrictiva en producción (whitelist desde `FRONTEND_URL` + soporte para previews de Vercel) y abierto en desarrollo.

---

## 4. Comparativa con alternativas

Esta sección documenta **por qué se eligió cada herramienta y por qué se descartaron las alternativas que también estaban sobre la mesa**.

### 4.1 Frameworks de backend

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **Express 5** ✅ | Maduro, sintaxis sencilla, middleware abundante, perfectamente conocido. | Sin opinión sobre arquitectura; hay que estructurar a mano. | **Elegido** por simplicidad y por adecuarse al alcance docente del TFG. |
| Fastify | ~2× más rápido que Express en benchmarks, schema validation built-in. | Ecosistema más pequeño; menos ejemplos en español para alumnos. | Descartado: la diferencia de rendimiento no es perceptible con el volumen previsto del TFG. |
| NestJS | DI, módulos, decoradores, sensación "Spring/Angular". | Curva de aprendizaje alta, sobre-ingeniería para el alcance. | Descartado: añade conceptos (DI, decorators, módulos) que el TFG no necesita demostrar. |
| Koa | Sintaxis moderna con async/await. | Comunidad menor que Express. | Descartado por la misma razón que Fastify. |

### 4.2 ORM / ODM

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **Mongoose** ✅ | Esquemas declarativos, validaciones, hooks, `populate` para joins simulados. | Tipado TS menos sólido que Prisma; añade abstracción sobre el driver. | **Elegido**: imprescindible para un proyecto con relaciones (User ↔ Cita ↔ Programa). |
| Driver nativo `mongodb` | Más cercano al "metal", máximo rendimiento. | No hay validación de esquema → fácil dejar datos corruptos. | Descartado: la integridad de datos importa más que el rendimiento. |
| Prisma + Postgres | Tipado top, migraciones automáticas. | Implica cambiar a SQL (ver 4.3). | Descartado al elegir MongoDB. |
| TypeORM | Soporta varios SQL. | Inestable históricamente, problemas con migraciones. | No considerado. |

### 4.3 Base de datos: SQL vs NoSQL

Se evaluó:
- **PostgreSQL** — esquema rígido, joins potentes, transacciones ACID.
- **MongoDB** — schemaless, escalabilidad horizontal, documento embebido.

**Decisión: MongoDB**. Justificación:
- Durante el TFG el modelo iteró varias veces (p. ej. `Programa.contenido` empezó siendo `string[]` y terminó siendo un subdocumento tipado `ISesionContenido[]`). En MongoDB esto se hace con un `npm run seed` sin migraciones. En Postgres habría requerido escribir migraciones de schema.
- Algunos recursos son fundamentalmente documentos jerárquicos (un Post con sus comentarios anidados → ideal para subdocumentos embebidos).
- Atlas ofrece tier gratuito robusto para el TFG.

Lo que se sacrifica: la imposibilidad de hacer joins reales — se mitiga con `populate()` de Mongoose, suficiente para nuestro volumen.

### 4.4 Autenticación

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **JWT** ✅ | Stateless, escala horizontalmente sin sesiones compartidas. | Difícil invalidar tokens antes de su expiración. | **Elegido**: alineado con la separación cliente/servidor. |
| Sesiones server-side con cookie | Invalidación inmediata. | Requiere store compartido (Redis) en multi-instancia. | Descartado por la complejidad operativa. |
| OAuth2 puro (Auth0) | Externalizar identidad. | Dependencia externa + coste. | Descartado; sí integramos **Google Sign-In** como opción complementaria. |

Detalles:
- Token firmado HS256 con `JWT_SECRET` (se avisa en producción si tiene < 32 caracteres).
- Expiración configurable vía `JWT_EXPIRES_IN` (por defecto 7 días).
- Middleware `autenticar` extrae el token, lo verifica y deja `req.usuarioId` disponible.
- `requireRol(...)` envuelve `autenticar` y comprueba el rol del usuario.

### 4.5 Frontend framework

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **React 19** ✅ | Más adoptado del mercado, ecosistema más amplio, MUI / react-router / react-hook-form pensados para él. | Curva con hooks; renders innecesarios sin cuidado. | **Elegido** por ecosistema y empleabilidad. |
| Vue 3 | Sintaxis más cercana al HTML clásico, fácil de aprender. | Ecosistema menor, menos integración con MUI. | Descartado: queríamos MUI. |
| Svelte / SvelteKit | Compilado, bundle mínimo, sintaxis cómoda. | Ecosistema pequeño, librerías UI inmaduras. | Descartado por madurez de UI libs. |
| Angular | Opinionado, DI, TypeScript first. | Verboso, curva alta, RxJS para todo. | Descartado por complejidad. |

### 4.6 Build tool

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **Vite 7** ✅ | Dev server sub-segundo, HMR instantáneo, build con Rollup. | Algunas libs antiguas (CommonJS) requieren config. | **Elegido**. |
| Create React App | Cero config inicial. | **Deprecated** desde 2023. | Descartado: sin mantenimiento. |
| Webpack + ts-loader | Máxima personalización. | Lento de configurar y arrancar. | Descartado por velocidad de desarrollo. |
| Next.js | SSR/SSG, file-based routing, image optimization. | Acopla cliente y servidor → contradice nuestra arquitectura separada. | Descartado por arquitectura (queríamos un frontend que también pudiera vivir como app móvil mañana). |

### 4.7 Sistema de UI

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **MUI 7** ✅ | Componentes ricos, theming muy potente, accesibilidad razonable, comunidad gigante. | Bundle pesado (~370 kB minified, ~115 kB gzip). | **Elegido**. Mitigado con code splitting via lazy loading de páginas. |
| Tailwind CSS | Utility-first, súper customizable. | Hay que componer todos los componentes manualmente; lleva más tiempo. | Descartado: el TFG no es un proyecto de design system desde cero. |
| Chakra UI | Más sencillo y "amistoso" que MUI. | Menor cantidad de componentes complejos. | Considerado, descartado por madurez. |
| Ant Design | Componentes empresariales. | Estética muy "form-heavy", inglés/chino por defecto. | Descartado por estética (queríamos calma, no enterprise). |

Se optó además por **personalizar profundamente el tema** (paleta sage/sand, tipografía Plus Jakarta Sans, sombras en tinta translúcida, curvas de animación tipo Apple) para evitar el "look genérico MUI".

### 4.8 Animaciones

| Opción | Decisión |
|--------|----------|
| **Framer Motion** ✅ | API declarativa (`variants`, `AnimatePresence`), integra con React, soporta `prefers-reduced-motion`. |
| CSS transitions puras | Suficiente para hover, no para route transitions con stagger. |
| GSAP | Potente pero imperativo, no encaja con el modelo React. |

`PageTransition.tsx` combina `opacity + y + blur` con curva `cubic-bezier(0.32, 0.72, 0, 1)` (curva "fluida" tipo Apple), efecto zen.

### 4.9 Tour guiado

| Opción | Decisión |
|--------|----------|
| **react-joyride 2.9** ✅ | API estable, popovers controlables, soporte para localStorage, callbacks claros (`STATUS`, `EVENTS`). |
| react-joyride 3.x | API rediseñada (`onEvent` en vez de `callback`, `nextLabelWithProgress` distinto, sin `disableBeacon`). Se evaluó **y se rechazó tras intentar usarla**: la documentación en 3.x está en construcción y el cambio de API rompía implementaciones existentes. Documentamos la incompatibilidad en `memory/project_stack.md`. |
| intro.js | Más antiguo, peor integración con React. |
| Shepherd.js | Bien, pero la integración React es comunitaria. |
| driver.js | Ligero, pero menos features para tours complejos. |

### 4.10 Gráficas

| Opción | Decisión |
|--------|----------|
| **Recharts + Chart.js** ✅ | Recharts es declarativo (componentes React), Chart.js cubre tipos avanzados. Ambos coexisten en el bundle. |
| D3.js directo | Demasiado bajo nivel para el alcance del TFG. |
| Plotly | Bundle enorme. |

### 4.11 Formularios

| Opción | Decisión |
|--------|----------|
| **react-hook-form 7** ✅ | Renders mínimos (`uncontrolled` por defecto), API clara, integra con yup. |
| Formik | Más lento (controlled inputs), menos mantenido en 2024-2026. |
| Estado manual con `useState` | Inviable para formularios largos. |

### 4.12 Cliente HTTP

| Opción | Decisión |
|--------|----------|
| **Axios** ✅ | Interceptores (clave para inyectar el JWT en cada petición y manejar 401), `baseURL`, parseo automático de JSON. |
| fetch nativo | Requiere wrapper manual para interceptores. Más ceremonia para tareas comunes. |

### 4.13 Tests

| Opción | Decisión |
|--------|----------|
| **Backend: Jest + ts-jest + supertest + mongodb-memory-server** ✅ | Estándar en Node; supertest permite testear endpoints sin levantar el servidor; mongodb-memory-server da bases efímeras. |
| **Frontend: Vitest + @testing-library/react** ✅ | Vitest comparte runtime con Vite (rapidísimo). Testing Library promueve testear desde la perspectiva del usuario. |
| Cypress / Playwright (E2E) | Habría sido valioso pero se prioriza la cobertura unitaria/integración por tiempo. |

---

## 5. Modelo de datos

### 5.1 Esquemas (resumen)

#### Usuario

```ts
{
  nombre: string,
  email: string (único),
  password: string (bcrypt),
  googleId?: string,
  rol: "usuario" | "profesional" | "admin",
  estado: "activo" | "inactivo" | "pendiente",
  fechaRegistro: Date,
  puntos: number,
  nivel: number,
  suscripcion: "free" | "premium" | "profesional"
}
```

El hash de contraseña se hace con un `pre("save")` hook que solo recomputa si la propiedad fue modificada.

#### Programa

```ts
{
  titulo: string,
  descripcion: string,
  duracion: string,           // "4 semanas"
  sesiones: number,
  sesionesCompletadas: number,
  color: string,              // token del tema MUI
  categoria: "mindfulness" | "emoción" | "sueño" | "estrés",
  contenido: ISesionContenido[],
  isPremium: boolean,
  createdAt: Date
}

ISesionContenido = {
  titulo: string,
  descripcion?: string,
  videoUrl?: string,          // ID de YouTube
  puntos?: number,
  duracion?: string           // "12 min"
}
```

**Decisión documentada**: `contenido` empezó como `string[]` (solo títulos). Al implementar `ProgramaDetalle.tsx`, el frontend pedía sesiones con vídeo, puntos y duración. Se migró el schema a subdocumento tipado y se actualizó el seed con `findOneAndUpdate({ upsert: true })` para refrescar los datos existentes.

#### Cita

```ts
{
  cliente: ObjectId (ref Usuario),
  profesional: ObjectId (ref Usuario),
  fecha: Date,
  estado: "pendiente" | "confirmada" | "cancelada" | "completada",
  notas?: string,
  linkReunion?: string,
  createdAt: Date
}
```

#### Meta, Post, Recurso

Similar estructura: claves explícitas, refs a Usuario cuando aplica, subdocumentos para comentarios anidados en Post.

### 5.2 Decisiones de modelado

- **Subdocumentos vs referencias**: comentarios en Post → subdocumentos (siempre se consultan junto al post). Cliente y profesional en Cita → referencias (existen vidas independientes). Sesiones de un Programa → subdocumentos (siempre se cargan juntas con el programa).
- **No usamos transacciones** (MongoDB las soporta) porque el modelo no exige operaciones atómicas multi-documento.
- **`_id: false`** en subdocumentos cuando no se necesitan identificadores propios (sesiones de programa), para ahorrar tamaño.

---

## 6. API REST — listado de endpoints

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| GET | `/api/health` | — | — | Healthcheck (uptime, conexión DB). |
| POST | `/api/auth/registro` | — | — | Crear cuenta. |
| POST | `/api/auth/login` | — | — | Iniciar sesión. |
| POST | `/api/auth/google` | — | — | Iniciar sesión con Google OAuth. |
| GET | `/api/auth/me` | ✅ | — | Datos del usuario logueado. |
| PUT | `/api/auth/me` | ✅ | — | Editar perfil. |
| GET | `/api/programas` | — | — | Listar (público). |
| GET | `/api/programas/:id` | — | — | Detalle. |
| POST | `/api/programas` | ✅ | admin/prof | Crear. |
| PUT | `/api/programas/:id` | ✅ | admin/prof | Editar. |
| DELETE | `/api/programas/:id` | ✅ | admin/prof | Borrar. |
| GET | `/api/recursos` | ✅ | — | Listar biblioteca. |
| POST | `/api/recursos` | ✅ | admin/prof | Crear recurso. |
| GET | `/api/citas` | ✅ | — | Mis citas (filtra por rol). |
| POST | `/api/citas` | ✅ | — | Reservar. |
| PUT | `/api/citas/:id` | ✅ | prof/admin | Confirmar/cancelar. |
| **DELETE** | **`/api/citas/:id`** | ✅ | — | **Cancelar (añadido durante el TFG, el frontend lo llamaba antes de existir).** |
| GET | `/api/citas/profesionales` | ✅ | — | Listar profesionales disponibles. |
| GET | `/api/metas` | ✅ | — | Listar metas. |
| POST | `/api/metas` | ✅ | — | Crear meta. |
| PUT | `/api/metas/:id/toggle` | ✅ | — | Marcar/desmarcar. |
| DELETE | `/api/metas/:id` | ✅ | — | Borrar. |
| GET | `/api/posts` | ✅ | — | Feed. |
| POST | `/api/posts` | ✅ | — | Publicar. |
| PUT | `/api/posts/:id/like` | ✅ | — | Like / unlike. |
| POST | `/api/posts/:id/comentar` | ✅ | — | Comentar. |
| GET | `/api/admin/usuarios` | ✅ | admin | Listar usuarios. |
| PUT | `/api/admin/usuarios/:id/aprobar` | ✅ | admin | Aprobar profesional. |
| PUT | `/api/admin/usuarios/:id/estado` | ✅ | admin | Cambiar estado. |
| GET | `/api/chat/suggestions` | — | — | Preguntas iniciales del bot. |
| POST | `/api/chat` | ✅ | — | Chat (IA + fallback). |

---

## 7. Frontend — arquitectura

### 7.1 Routing

- `react-router 7` con `<Routes>` declarativas.
- Las páginas se cargan con `React.lazy()` → cada ruta es un chunk separado. Impacto: bundle inicial pequeño, hidratación rápida.
- `<ProtectedRoute>` envuelve las rutas privadas y redirige a `/login` si no hay sesión.

### 7.2 Contextos globales

- **`AuthContext`**: gestiona `usuario`, `loading`, `login()`, `logout()`. Al montarse, llama a `GET /auth/me` para rehidratar la sesión desde el token guardado en `localStorage`.
- **`TourContext`**: orquesta el tour guiado con `react-joyride`. Detecta el primer login (flag `mb_tour_completed_v1` en localStorage) y lo dispara automáticamente. Expone `startTour()` para iniciarlo manualmente desde el botón "?" de la TopBar.

### 7.3 Servicios

- **`services/api.ts`** — instancia Axios con `baseURL = VITE_API_URL`, interceptor `request` que inyecta `Authorization: Bearer ${token}`, interceptor `response` que dispara `CustomEvent("api:error")` para 401/5xx.
- **`services/chatService.ts`** — wrapper tipado: `sendMessageToAI()`, `fetchChatSuggestions()`.

### 7.4 Componentes globales

- **`TopBar`** — AppBar con glassmorphism (`backdrop-filter: saturate(180%) blur(18px)`), logo MindBalance, saludo personalizado, botón de ayuda, avatar con menú.
- **`Sidebar`** — Drawer permanente en desktop / temporal en mobile. Item seleccionado con barra lateral animada y gradiente sage. Pie con "Frase del día".
- **`Chatbot`** — burbuja flotante con FAB, panel `Slide` desde abajo, header con gradiente, chips de sugerencias, render Markdown ligero.
- **`PageTransition`** — wrapper con motion variants (opacity + y + blur), curva zen.
- **`ProtectedRoute`** — verifica autenticación; renderiza spinner mientras `loading`.
- **`GlobalSnackbar`** — escucha `CustomEvent("api:error" | "app:notify")` y muestra `Snackbar`.
- **`ErrorBoundary`** — captura errores de render y muestra una pantalla limpia.

### 7.5 Sistema de diseño

Implementado como **tokens en `theme/theme.ts`**:

- **Paleta semántica** (`SAGE`, `SAND`, `INK`, `CORAL`) en escalas 50–900.
- **Tipografía**: Plus Jakarta Sans (Google Fonts) con letter-spacing negativo en headings.
- **Sombras**: 25 niveles en tinta translúcida `rgba(31, 58, 64, α)` para una sensación más coherente que negros puros.
- **Animaciones**: curva `cubic-bezier(0.32, 0.72, 0, 1)` (zen), duraciones 140–420 ms.
- **Radios**: 16 px base, 20 px en cards, 999 (pill) en botones/chips.
- **Background ambient**: dos auras radiales muy diluidas (sage arriba-izda, sand abajo-dcha) inyectadas vía `MuiCssBaseline`.
- **Overrides** en MuiButton, MuiCard, MuiTextField, MuiAppBar, MuiDrawer, MuiListItemButton, etc., para que cada componente respete el lenguaje visual sin tener que reespecificar `sx` en cada uso.

---

## 8. Funcionalidades destacadas

### 8.1 Tour guiado para nuevos usuarios

**Problema**: la plataforma tiene 7+ secciones distintas. Sin orientación, un usuario nuevo puede sentirse perdido.

**Solución**: `TourContext` + `react-joyride` con 10 pasos que recorren:
1. Bienvenida centrada.
2-8. Cada item del Sidebar (Dashboard, Programas, Biblioteca, Comunidad, Sesiones, Progreso, Suscripciones) con spotlight y popover.
9. Avatar (cuenta).
10. Botón "?" (cómo relanzar el tour).

Detalles:
- **Auto-start**: si `localStorage["mb_tour_completed_v1"]` no existe y el rol es `usuario`, se lanza a los 800 ms después del login.
- **Disparo manual** desde la TopBar con un icono `HelpOutline`.
- **Persistencia**: al cerrar/finalizar, se marca el flag para no repetir.
- **Localización**: textos en español (`back: "Atrás"`, `nextLabelWithProgress: "Siguiente ({step}/{steps})"`, `skip: "Saltar tour"`).
- **Estilo**: primary color sage, esquinas redondeadas, sombra suave para integrarse con el resto del producto.

### 8.2 Chatbot híbrido IA + base de conocimiento

**Problema**: dependencia de un servicio externo (Gemini). Si la API key no está configurada, la cuota se agota o Google devuelve un 5xx, el usuario se queda sin asistente — mala experiencia.

**Solución**: arquitectura de **doble camino** en `chatController.ts`:

```
POST /api/chat
  │
  ├─ ¿Hay GEMINI_API_KEY?
  │     NO  → answerFromKB() ─────────────────► reply (source: "fallback")
  │     SÍ  → llamar a Gemini con 3 modelos en cascada
  │              (gemini-2.0-flash → 2.5-flash → flash-latest)
  │              cada uno con 2 intentos en caso de 429
  │
  ├─ ¿Algún intento devolvió texto?
  │     SÍ  → reply (source: "ai")
  │     NO  → answerFromKB() ─────────────────► reply (source: "fallback")
  │
  └─ Cualquier excepción inesperada → answerFromKB() con HTTP 200
```

**`chatFallback.ts`** define una **knowledge base** de 17 entradas categorizadas (saludo, onboarding, citas, programas, ansiedad, sueño, premium, perfil, privacidad, etc.). Cada entrada tiene:
- `patterns: RegExp[]` — palabras clave a buscar en el mensaje (en español, con tildes y diminutivos).
- `reply: string` — respuesta con **Markdown ligero** (`**negrita**`).
- `followUps?: string[]` — sugerencias clickables que aparecen como chips bajo la respuesta.

El frontend renderiza el Markdown con una función propia (`renderRich`) que no requiere instalar `react-markdown` (ahorro de bundle: ~60 kB).

**Decisiones específicas**:
- Modelo primario `gemini-2.0-flash` (no `2.5-flash`) porque 2.5 tiene **"thinking tokens"** activados por defecto: gasta presupuesto interno razonando y deja respuestas cortadas si `maxOutputTokens` no es enorme. Si por cuota se cae a 2.5, le pasamos `thinkingConfig: { thinkingBudget: 0 }`.
- `temperature: 0.7` — balance entre coherencia y naturalidad.
- `systemInstruction` indica el rol del bot, formato Markdown ligero, idioma español, y recomendación de derivar a teleconsulta ante síntomas serios.
- **`apiKey.trim()` defensivo** — `dotenv` deja un `\r` final si el `.env` se editó en Windows (CRLF), lo cual rompe la URL de Google con un *Malformed input to a URL function*. Documentado en sección 11.

### 8.3 Sistema de gamificación

- **Puntos** (XP) atribuidos al completar sesiones de programas.
- **Nivel** calculado a partir de XP acumulados (umbral: 2500 XP por nivel).
- **Metas personales** (CRUD): tick/untick optimista en el frontend con `PUT /metas/:id/toggle`.
- **Racha** de días consecutivos completando metas (próximamente: registrar racha real en backend).
- **Tienda de puntos** (placeholder visual para futuros canjes).

### 8.4 Teleconsultas

Flujo completo end-to-end:
1. Usuario navega a `/sesiones` → frontend solicita `/citas/profesionales` y `/citas` en paralelo.
2. Pulsa **Reservar sesión** → abre `<Dialog>` con datetime-local input.
3. Confirma → `POST /citas` con `profesionalId`, `fecha`, `notas`.
4. Aparece en "Mis Citas Programadas" en estado **pendiente**.
5. El profesional confirma desde su panel → estado **confirmada** + `linkReunion`.
6. Aparece el botón **Unirse a videollamada** (abre en nueva pestaña).
7. Cancelar → `DELETE /citas/:id` (endpoint añadido durante el TFG porque el frontend ya lo llamaba pero no existía en el backend; ver sección 11.4).

### 8.5 Comunidad

- Feed con paginación (a futuro, ahora carga completa).
- Crear post → `POST /posts` con texto y hashtags detectados.
- Like / unlike → `PUT /posts/:id/like` (idempotente: alterna).
- Comentar → `POST /posts/:id/comentar`.
- Filtros por hashtag, lista de tendencias, sugerencias "A quién seguir" (mock visual).

---

## 9. Decisiones de diseño UX/UI

### 9.1 Paleta semiótica

Los colores **no son arbitrarios**:

- **Sage `#3A998A`** — verde salvia → asociado culturalmente a calma, naturaleza, sanación.
- **Sand `#C29A5B`** — arena cálida → sensación de hogar y estabilidad.
- **Ink `#1F3A40`** — tinta verde-azulada en lugar de negro → más cálido, menos agresivo en el contraste de texto.

Contrastes verificados para AA según WCAG 2.1.

### 9.2 Tipografía

- **Plus Jakarta Sans** — geométrica humanista, moderna pero amigable. Letter-spacing negativo en headings (`-0.02em` a `-0.025em`) para densidad sin perder legibilidad.
- Pesos 400/500/600/700/800.
- Line-height 1.65 en cuerpo → texto que respira (relevante para una app de bienestar).

### 9.3 Animaciones

- **Curva `cubic-bezier(0.32, 0.72, 0, 1)`** — "ease-out fuerte", sensación natural, no robótica.
- **Duraciones moderadas** (250–500 ms) → ni instantáneas (frías) ni largas (frustrantes).
- **`prefers-reduced-motion`** — respetado globalmente con un `@media` en `index.css` que pone `animation-duration: 0.01ms !important`.
- **PageTransition** combina opacity + Y translate + blur — el blur ligerísimo (`4px → 0`) da sensación de "enfoque" propia de las apps de meditación.

### 9.4 Glassmorphism

`TopBar` y `Drawer` usan `backdrop-filter: saturate(180%) blur(18px)` con fondo semi-transparente. Resultado: la barra parece "flotar" sobre el contenido, refuerza la profundidad sin sombras pesadas.

### 9.5 Accesibilidad

- `:focus-visible` con outline verde sage 2 px + offset 2 px.
- `aria-label` en todos los iconos clickables (`abrir menú`, `iniciar tour`, `enviar`, etc.).
- `aria-hidden` en elementos puramente decorativos (auras radiales).
- Roles ARIA implícitos respetados (uso semántico de `<button>`, `<nav>`, `<main>`).
- Contraste mínimo AA (verificado para `text.secondary` sobre `background.default`).
- Soporte de teclado en `Slide` del chatbot y en chips de sugerencia.
- Soporte explícito de `prefers-reduced-motion`.

---

## 10. Calidad del código

### 10.1 TypeScript estricto

Flags activadas en ambos lados:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitOverride: true`

Consecuencia: cualquier acceso a un array por índice retorna `T | undefined` y hay que comprobarlo. Más verboso pero blinda contra TypeErrors en runtime.

### 10.2 Tests

| Suite | Framework | Cobertura |
|-------|-----------|-----------|
| `backend/tests/auth.test.ts` | Jest + supertest + MMS | Registro válido / email duplicado / login OK / login con password incorrecta / `/me` con token / `/me` sin token. |
| `backend/tests/programas.test.ts` | Jest | GET público / GET autenticado / POST sin token (401). |
| `frontend/src/__tests__/AuthContext.test.tsx` | Vitest + RTL | Estado inicial loading / setUsuario tras login. |
| `frontend/src/__tests__/Login.test.tsx` | Vitest + RTL | Render del form / link a registro / validación / toggle de password. |

Estado actual: **9/9 backend** + **6/6 frontend** → todos pasan.

### 10.3 ESM nativo en Node

- `package.json` con `"type": "module"`.
- `tsconfig.json` con `module: "nodenext"`.
- Imports relativos con extensión `.js` aunque el archivo sea `.ts` (lo exige `nodenext` para alinearse con el resolver de Node).

Esto fue una **fuente recurrente de errores** durante el desarrollo y se documentó en `memory/project_stack.md` para no volver a tropezar.

### 10.4 Linting y formateo

- ESLint con preset para React + TypeScript.
- No se usó Prettier explícito; el formato sigue la salida natural de Edit/Write tools y los plugins de VS Code.

---

## 11. Problemas encontrados y solución

Esta sección documenta los problemas reales que se detectaron y se resolvieron durante el desarrollo — es la parte más rica desde la perspectiva del aprendizaje.

### 11.1 CRLF en `.env` rompiendo la API de Gemini

**Síntoma**: el endpoint del chat devolvía siempre el fallback FAQ, nunca llegaba a la IA real. Los logs no mostraban errores claros.

**Diagnóstico**: con `xxd .env | head` se descubrió que cada línea terminaba en `0d 0a` (CRLF, line endings de Windows) en lugar de solo `0a` (LF de Unix). `dotenv` por diseño **no recorta** los valores → la variable `GEMINI_API_KEY` quedaba con un `\r` final. Cuando se construía la URL `?key=AIzaSy...\r` Google la rechazaba con un `Malformed input to a URL function` (cosa que `curl` reproducía idénticamente).

**Solución doble**:
1. **Convertir el archivo**: `tr -d '\r' < .env > .env.tmp && mv .env.tmp .env`.
2. **Defensiva en el código**: `const apiKey = (process.env.GEMINI_API_KEY || "").trim();` — para que el problema no vuelva si otro contribuidor edita el `.env` en Windows.

**Lección**: nunca confiar en que `dotenv` te dé strings limpios; aplicar `.trim()` por defecto a cualquier valor que vaya a una URL.

### 11.2 Thinking tokens en Gemini 2.5

**Síntoma**: cuando empezamos a usar `gemini-2.5-flash` como modelo primario, las respuestas se cortaban a media frase: *"MindBalance se distingue por ser una plataforma integral que te ofrece un ecosistema completo para"*.

**Diagnóstico**: en la metadata de los modelos 2.5 figura `"thinking": true`. Esto significa que el modelo gasta tokens internos razonando **antes** de generar la respuesta visible. Con `maxOutputTokens: 500`, esos tokens "thinking" se comían el presupuesto y la respuesta visible quedaba truncada.

**Solución**:
1. Reordenar la cascada para que `gemini-2.0-flash` (sin thinking) sea el primario y se llame a 2.5 solo si falla.
2. Cuando se usa un modelo 2.5, pasar `generationConfig.thinkingConfig = { thinkingBudget: 0 }` para desactivar el "pensamiento interno".
3. Subir `maxOutputTokens` de 500 a **1024** como holgura, sin llegar a valores excesivos que aumenten la latencia.

**Lección**: las APIs de LLM están en evolución rápida; comportamientos por defecto (como "thinking") cambian entre versiones del mismo modelo. Documentar el modelo concreto que se está usando y por qué.

### 11.3 Hydration warning en `<ListItemText>` con Box anidado

**Síntoma**: en consola del navegador, en `ProgramaDetalle.tsx`, aparecían avisos *In HTML, `<div>` cannot be a descendant of `<p>`* repetidos en cada sesión. Las cards renderizaban bien visualmente pero el HTML era inválido.

**Diagnóstico**: MUI envuelve la prop `secondary` de `<ListItemText>` en una `<Typography variant="body2">` que renderiza como `<p>`. Dentro de ese `<p>` estábamos metiendo un `<Box>` (que es `<div>`) y `<Chip>`s (que también son `<div>`).

**Solución**: añadir `disableTypography` al `ListItemText` para que NO envuelva la prop `secondary` en una Typography automática, dejando que nosotros decidamos cómo renderizarla.

**Lección**: leer la documentación de las props "automágicas" de MUI antes de meter contenido complejo dentro.

### 11.4 Frontend llamando a endpoints inexistentes

**Síntoma**: el botón "Cancelar" en `Sesiones.tsx` llamaba a `DELETE /api/citas/:id`. El backend respondía 404.

**Diagnóstico**: una auditoría completa de la API mostró que el endpoint nunca se había implementado en `routes/cita.ts` ni en `citaController.ts`.

**Solución**: implementar `cancelarCita` con autorización adecuada — el cliente puede cancelar su propia cita, el profesional puede cancelar las suyas, el admin puede cancelar cualquiera. Devuelve 403 si nadie de esos.

```ts
const esCliente = cita.cliente.toString() === usuarioId;
const esProfesional = cita.profesional.toString() === usuarioId;
const esAdmin = usuario?.rol === "admin";
if (!esCliente && !esProfesional && !esAdmin) return res.status(403);
```

**Lección**: hacer auditorías periódicas de "todos los `api.X` del frontend" contra "todos los `router.X` del backend" para detectar contratos rotos.

### 11.5 Esquema `Programa.contenido` desalineado con el frontend

**Síntoma**: `ProgramaDetalle.tsx` esperaba un array de objetos `{ titulo, descripcion, videoUrl, puntos, duracion }`. El esquema Mongoose tenía `contenido: string[]` (solo títulos). El componente caía a un fallback de mock data.

**Solución**: migrar el esquema:
```ts
const sesionContenidoSchema = new Schema<ISesionContenido>({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  videoUrl: { type: String },
  puntos: { type: Number, default: 50 },
  duracion: { type: String },
}, { _id: false });
```
Y actualizar `seed.ts` para usar `findOneAndUpdate({ upsert: true, setDefaultsOnInsert: true })` para refrescar los datos existentes sin perderlos.

**Lección**: cuando frontend y backend se desarrollan en paralelo, los tipos compartidos (idealmente en un paquete `shared/`) son críticos. Aquí no se hizo y obligó a migrar.

### 11.6 Mock fallbacks que disfrazaban datos vacíos

**Síntoma**: páginas como `Sesiones.tsx`, `Comunidad.tsx` y `ProgramaDetalle.tsx` rellenaban con datos mock cuando el API devolvía vacío o fallaba. Resultado: el TFG mostraba "Sofía Rodríguez" y "Dr. Miguel Ángel" como si fueran usuarios reales, ocultando que la integración con el backend no estaba completa.

**Solución**: eliminar todos los fallbacks `if (data.length === 0) setData(mockData)` y reemplazarlos por **empty states** reales y honestos ("Aún no hay publicaciones. ¡Sé el primero!"). Esto obligó al backend a tener seeds funcionales (que se hicieron en `dev-with-memory.ts`).

**Lección**: los mocks pueden ser útiles en wireframes, pero deben desaparecer antes de la entrega — generan una falsa sensación de progreso.

### 11.7 Tests rotos por configuración estricta de TypeScript

**Síntoma**: `npm test` (backend) fallaba con `TSError: ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'`. La causa: Jest cargaba `jest.config.ts` con la misma config TS del proyecto, y `verbatimModuleSyntax: true` no es compatible con cómo Jest interpreta el archivo.

**Solución**: convertir `jest.config.ts` → `jest.config.js` con `export default`. Además, los tests requerían que `JWT_SECRET` y `MONGODB_URI` estuvieran definidas **antes** de cargar `src/config/env.ts` (que hace `process.exit(1)` si faltan). Se añadió al inicio de `tests/setup.ts`:

```ts
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-mindbalance-only-for-tests";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:0/test";
process.env.NODE_ENV = "test";
// luego imports
```

**Lección**: las configs de tooling (Jest, ESLint, Vite…) a veces necesitan vivir fuera de la disciplina estricta del código de producción.

---

## 12. Roadmap / mejoras futuras

Documentado como punto de partida para futuras iteraciones (post-TFG):

1. **Tipos compartidos** entre frontend y backend en un paquete `shared/` o vía OpenAPI. Eliminaría definiciones duplicadas (`User`, `Programa`, `Cita`).
2. **Streaming en el chatbot** — usar SSE para ir mostrando la respuesta de Gemini palabra a palabra (mejor UX en respuestas largas).
3. **Notificaciones push** — recordatorios de sesión, citas próximas.
4. **PWA** — manifest + service worker para instalar como app y soporte offline básico.
5. **i18n** — soporte para inglés con `react-intl` o `i18next`.
6. **Tests E2E** con Playwright (regresión visual y flujos críticos).
7. **Métricas reales en Dashboard** (`/api/dashboard/summary`) — actualmente Dashboard solo carga la próxima cita.
8. **Auditoría de bundle** — `vendor-three` pesa 1.1 MB; valorar si los efectos 3D justifican esa carga.
9. **Migrar el chatbot a function calling** — para que pueda *ejecutar* acciones (p. ej. agendar una cita) y no solo responder.
10. **Privacy controls** — exportar mis datos, borrar mi cuenta, anonimato en posts.

---

## 13. Resumen ejecutivo del valor técnico

Lo más relevante a destacar en la defensa del TFG:

- **Arquitectura desacoplada cliente/servidor** con dos lenguajes (TypeScript en ambos) y dos pipelines de despliegue independientes (Vercel + Render).
- **Diseño de API REST** documentado y consistente (29 endpoints), con autenticación JWT y autorización por roles.
- **Modelo de datos NoSQL** justificado por la flexibilidad necesaria durante la iteración del producto.
- **Sistema de diseño propio** sobre MUI (paleta, tipografía, sombras, animaciones), no un "tema por defecto".
- **Arquitectura híbrida del chatbot** (IA externa + base de conocimiento local) que garantiza disponibilidad incluso sin el servicio de IA.
- **Tour guiado** auto-disparado para mejorar el onboarding.
- **TypeScript estricto** en ambos lados (`strict + exactOptionalPropertyTypes + verbatimModuleSyntax + noUncheckedIndexedAccess`).
- **Tests automatizados** (15 en total, 100% en verde) cubriendo flujos críticos.
- **Resolución documentada de problemas reales** (CRLF en env, thinking tokens, hydration warnings, contratos rotos) con análisis de causa raíz, no solo parches.

La comparativa de alternativas en cada decisión técnica demuestra que las elecciones fueron **deliberadas**, no inerciales: para cada herramienta usada hay al menos 2-3 alternativas evaluadas y rechazadas con motivo.

---

*Documento generado durante el desarrollo del TFG. Versión: 2026-05-14.*
