# Toma de deciciones para crear el Proyecto

## Nombre

Un juego de palabras de [capymara](http://capymara.com) una web con la que intento prestar servicios con mi novia y la palabra management de administrar o gestionar.

## Backend

### Estructura

Se hizo con express y Js como fue solicitado, esctructura de carpeta y responsabilidades en los archivos usando el estilo de django dando como ejemplo controllers -> views, models -> models, routers -> urls.

### Middlewares

Se coloco el middleware sencillo de authenticacion, uno para validar los id de las request para evitar 500 en las solicitudes y un rateLimiter para evitar el espam de solicitudes ya que lo usaron en el video con el que repase las tecnologias (estara al final del archivo).

### Utils

#### Responses

Hice este archivo para que todas las respuestas tengan una misma estructura (es la estructura que uso en la mayoria de los proyectos a menos que el cliente prefiera otra).

#### Error handler

Encargado de centralizar el manejo de errores, los errores 500 van a un .log para verificar en que fallo el sistema (Me ayude con la AI para esta parte).

## Frontend

### Estructura

No estoy acostumbrado a desarrollar con Js asi que intente una estructura de carpetas similar a la que uso en flutter, pero al ser js un lenguaje dinamico no lo adapte al 100% ya que no estoy usando interfaces, pero intentando mantener las responsabilidades separadas en cada archivo.

#### Config

Carpeta donde coloque las constantes (De momento solo hay una) y la configuracion de la instancia de `axios` que llame `requests` al igual que la libreria de python.

#### Context

Encargado de los estados globales, en este solo esta Auth porque es lo que manejamos de forma global en esta parte (Me ayude con la ai en su construccion).

#### Presentation

Carpeta donde ubique todo lo que es ui como los componentes y paginas, las paginas estan sub divididas por los modulos que en este caso son auth, project, tasks.

#### Routes

Las rutas de la app

#### Services

Intento de centralizar las solicitues para tener el codigo un poco mas limpio (mejorable).

#### Utils

Se uso `Tailwind` para los estilos css, `toast` para las notificaciones, `daisyui` con el tema night que me gusto mas, `lucide-react` para el accesso a los iconos y `recharts` para los graficos.

Se tuvieron que modificar versiones de `nanoid` y `browserslist` aversiones anteriores porque use `pnpm` para mayor seguridad en la instalacion de paquetes, esos paquetes fueron actualizados ayer (21 junio 2026) y `pnpm` por seguridad no los deja utilizar en el despligue.

Utilice AI en gran parte del front end para acortar tiempo y para retocar algunas funcionalidades de la app, igual todo fue gestionado por mi.

## Deploy

### Docker

Utilice docker para desplegar el servicio con dockerfiles y docker composes, tiene uno para desplegar todo y otro para desplegar cada uno individual.

## Resources

Material de [Youtube](https://www.youtube.com/watch?v=F9gB5b4jgOI) que utilice para estudiar el tema.
