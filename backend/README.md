# Backend — Free-Maragements

API REST con Express 5 + MongoDB + JWT.

## Requisitos

- Node 23+
- pnpm 10+
- MongoDB 7+

## Variables de entorno

Copia `.env` desde el raíz del proyecto o crea uno con:

```
DB_HOST=localhost
DB_PORT=27017
DB_ROOT_USER=admin
DB_ROOT_PASSWORD=admin
DB_NAME=maragements
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=2h
SECRET_KEY=change-me-in-production
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

## Local

```bash
pnpm install
pnpm dev       # nodemon — http://localhost:8000
pnpm start     # node — http://localhost:8000
```

## Docker

```bash
# solo backend + mongo
docker compose up -d
```

## Endpoints

| Método | Ruta                                 | Auth | Descripción                                                   |
| ------ | ------------------------------------ | ---- | ------------------------------------------------------------- |
| POST   | `/api/auth/register`                 | —    | Registro: name, email, password                               |
| POST   | `/api/auth/login`                    | —    | Login: email, password → { user, accessToken }                |
| GET    | `/api/auth/me`                       | JWT  | Perfil del usuario autenticado                                |
| GET    | `/api/projects`                      | JWT  | Lista de proyectos (search, dueDate)                          |
| POST   | `/api/projects`                      | JWT  | Crear proyecto                                                |
| GET    | `/api/projects/:id`                  | JWT  | Detalle de proyecto                                           |
| PUT    | `/api/projects/:id`                  | JWT  | Editar proyecto                                               |
| DELETE | `/api/projects/:id`                  | JWT  | Eliminar proyecto                                             |
| GET    | `/api/tasks`                         | JWT  | Lista de tareas (projectId, status, priority, page, pageSize) |
| POST   | `/api/tasks`                         | JWT  | Crear tarea                                                   |
| PUT    | `/api/tasks/:id`                     | JWT  | Editar tarea                                                  |
| DELETE | `/api/tasks/:id`                     | JWT  | Eliminar tarea                                                |
| GET    | `/api/reports/summary`               | JWT  | Totales y % completadas                                       |
| GET    | `/api/reports/projects-most-pending` | JWT  | Top 5 proyectos con más pendientes                            |
| GET    | `/api/reports/completed-tasks`       | JWT  | Tareas completadas (period: day, week, month)                 |
| GET    | `/api/reports/tasks-by-status`       | JWT  | Cantidad por estado                                           |
| GET    | `/api/reports/productivity-by-day`   | JWT  | Productividad por día (period: day, week, month)              |
