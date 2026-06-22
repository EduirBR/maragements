# Frontend — Free-Maragements

React 19 + Vite 8 + TailwindCSS 4 + daisyUI 5.

## Requisitos

- Node 23+
- pnpm 10+

## Variables de entorno

```env
VITE_BASEURL=http://localhost:8000   # opcional, default ""
```

Sin `VITE_BASEURL` las llamadas van a `/api` (útil con el proxy de Vite o nginx).

## Local

```bash
pnpm install
pnpm dev        # http://localhost:5173 (con proxy a :8000)
pnpm build      # producción → dist/
pnpm preview    # previsualiza el build
```

## Docker

```bash
docker build -t maragements-frontend \
  --build-arg VITE_BASEURL=http://localhost:8000 \
  .

docker run -p 8080:80 maragements-frontend #8080 es el puerto a exponer
```

Si el backend está en otro puerto/host, cambia `VITE_BASEURL`. Sin el build arg, las llamadas van a `/api` y el nginx del contenedor debe proxy reversear al backend.

## Rutas

| Ruta            | Acceso  | Descripción                   |
| --------------- | ------- | ----------------------------- |
| `/`             | Público | Landing page                  |
| `/login`        | Público | Inicio de sesión              |
| `/register`     | Público | Registro                      |
| `/dashboard`    | Privado | Dashboard con gráficos        |
| `/projects`     | Privado | Lista de proyectos            |
| `/projects/:id` | Privado | Detalle del proyecto + tareas |
| `/tasks`        | Privado | Lista global de tareas        |
