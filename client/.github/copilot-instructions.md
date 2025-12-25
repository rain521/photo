# Copilot instructions for this repository ✅

Purpose
- Brief, actionable notes to help AI coding agents get productive quickly in this Vue 3 + Vite + LeaferJS project.

Quick start (dev / build) 🔧
- Install: npm install
- Run dev server: npm run dev (Vite dev server opens automatically)
- Build: npm run build (runs `vue-tsc -b` then `vite build`)
- Preview build: npm run preview

Environment & important vars ⚙️
- VITE_API_BASE_URL: backend base URL (used by `src/api/config.ts`).
- VITE_PORT / VITE_PREVIEW_PORT: dev/preview ports (configured in `vite.config.ts`).
- Use `VITE_` prefix for env variables (Vite requirement).

Architecture / big picture 🏗️
- Frontend: Vue 3 (Composition API + <script setup>), TypeScript, Vite.
- State: Pinia (see `src/stores/`), app initializes user from localStorage in `src/main.ts`.
- Router: Vue Router lazy-loads pages in `src/router/index.ts`; route meta `.meta.title` is applied in `router.beforeEach`.
- UI & editor: LeaferJS editor components used extensively (see `src/components/editor.vue`).
- API layer: `src/api/request.ts` wraps axios and exports a `request` instance with typed helpers (.get/.post/etc.).

Key conventions & patterns 📚
- Alias: `@` -> `src` (see `vite.config.ts`). Use `@/...` in imports.
- API responses: shape exposed by `src/api/request.ts` as `ApiResponse<T> { status?, message?, data?, success? }`.
- Token storage: token kept in `localStorage` key `token`; request interceptor adds `Authorization: Bearer <token>` when present.
- Error handling: `request` has response interceptors; be careful—interceptor mixes HTTP status (`response.status`) and API body `res.status` checks (see `src/api/request.ts`).
- Components: prefer lazy loading pages with `() => import('...')` to keep chunks small (see `src/router/index.ts`).
- SCSS: global variables auto-injected (`@/styles/variables.scss`) via Vite `additionalData`.

Build / bundling notes ⚠️
- `vite.config.ts` manually chunks: `vue`, `leafer`, `axios` groups defined in `rollupOptions.output.manualChunks` — changes may affect output size and caching.
- Production build minifies with terser and drops console/debugger (see `build.terserOptions`).

Integration & important files to read first 🔎
- API and config: `src/api/request.ts`, `src/api/config.ts` (understand `ApiResponse` and `ResponseCode`).
- Auth flow: `src/stores/user.ts` (login/logout/initUser/fetchUserInfo).
- Editor examples: `src/components/editor.vue` (ClipImage, groups, and editing patterns).
- Routing and titles: `src/router/index.ts`.
- Main entry: `src/main.ts` (Pinia setup, user init).

Examples (copy/paste snippets) 💡
- Fetch current user: `request.get<UserInfo>('/manager/api/customers/current')` (see `src/stores/user.ts`).
- POST authenticate: `request.post('/manager/api/customers/authenticate', { phone, password, rememberMe: true, storeId: '1' })`.
- Add a route: in `src/router/index.ts`, add a `RouteRecordRaw` with `component: () => import('../views/...')` and set `meta.title`.

Gotchas / notes for contributors ⚠️
- There are no test scripts in `package.json`. If adding tests, add scripts and CI steps.
- Proxy in Vite rewrites `/api` → removed prefix; existing code calls `/manager/api/...` directly—double-check API base URLs when debugging network issues.
- `request` methods cast response to `T` (e.g., `.get<T>` returns `T` directly), so ensure server's response body matches expected types.

When editing this file
- If you find missing or confusing patterns, update this document with concise, verifiable examples and reference the exact file paths.

Next step
- Ask for clarifications or point out additional areas you want me to include (tests, CI, release process, or backend contracts). Please suggest additions or corrections.
