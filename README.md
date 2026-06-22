# Free-Maragements

App fullstack de gestión de proyectos y tareas con reportes y gráficos.

Puedes verlo [Aqui](free-maragement.capymara.com)

## Toma de deciciones

[ELABORACION.md](./ELABORACION.md)

## Requisitos

- Node 23+
- pnpm 10+
- MongoDB 7+
- Docker (opcional, para despliegue)

## Estructura

```
backend/   → API REST con Express 5 + Mongoose + JWT
frontend/  → SPA con React 19 + Vite 8 + TailwindCSS 4 + daisyUI 5
```

## Cómo correr todo local

```bash
# 1. Clonar y entrar
git clone <repo> && cd maragements

# 2. Backend
cd backend
cp .env.example .env         # o copia del .env del raíz
pnpm install
pnpm dev                        # http://localhost:8000

# 3. Frontend (otra terminal)
cd frontend
pnpm install
pnpm dev                        # http://localhost:5173
```

## Docker

```bash
# Fullstack (backend + frontend + mongo)
docker compose up -d
```

Acceder a `http://localhost:{FRONTEND_PORT}` (frontend).

## Documentación por entorno

- [Backend](./backend/README.md) — endpoints, variables de entorno, docker
- [Frontend](./frontend/README.md) — rutas, build, docker

## Variables de entorno

Ver `.env` en la raíz. Las principales:

| Variable               | Default       | Descripción                    |
| ---------------------- | ------------- | ------------------------------ |
| `DB_ROOT_USER`         | `admin`       | Usuario MongoDB                |
| `DB_ROOT_PASSWORD`     | `admin`       | Contraseña MongoDB             |
| `DB_NAME`              | `maragements` | Base de datos                  |
| `JWT_SECRET`           | —             | Secreto para firmar JWT        |
| `JWT_EXPIRES_IN`       | `2h`          | Expiración del token           |
| `BACKEND_PORT`         | `8000`        | Puerto del backend (host)      |
| `FRONTEND_PORT`        | `8080`        | Puerto del frontend (host)     |
| `MONGO_PORT`           | `27017`       | Puerto de MongoDB (host)       |
| `RATE_LIMIT_MAX`       | `100`         | Máximo de requests por ventana |
| `RATE_LIMIT_WINDOW_MS` | `900000`      | Ventana de rate limit (ms)     |
