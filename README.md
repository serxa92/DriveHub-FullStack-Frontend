# DriveHub

Plataforma full-stack de compraventa y gestión integral de vehículos desarrollada como proyecto final de máster. Incluye un catálogo público bilingüe y un área administrativa protegida para gestionar inventario, clientes y ventas.

## Aplicación desplegada

- **Frontend:** [drive-hub-full-stack-frontend.vercel.app](https://drive-hub-full-stack-frontend.vercel.app)
- **API:** [backend-q3pm.onrender.com](https://backend-q3pm.onrender.com)
- **Backend:** [github.com/serxa92/DriveHub-Backend](https://github.com/serxa92/DriveHub-Backend)

> El backend está alojado en Render y puede tardar unos segundos en responder después de un periodo de inactividad.

## Funcionalidades

### Catálogo público

- Catálogo de 100 vehículos con fotografías y datos reales de demostración.
- Estados de disponibilidad: disponible, reservado y vendido.
- Búsqueda por marca o modelo sin distinguir mayúsculas ni tildes.
- Filtros por marca, estado, combustible, transmisión, año, kilometraje y precio.
- Ordenación por precio, año y kilometraje.
- Fichas con precio, especificaciones, observaciones y estado actualizado.
- Vehículo destacado con rotación automática.
- Favoritos persistentes, sincronizados con los datos actuales de la API.
- Formulario de contacto asociado al vehículo seleccionado.
- Interfaz responsive y traducciones completas en español e inglés.

### Administración

- Autenticación mediante JWT y control de acceso por roles.
- Gestión del inventario de vehículos.
- Alta y edición de vehículos con galería y selección de portada.
- Gestión de clientes, intereses y estados de seguimiento.
- Creación y seguimiento de ventas.
- Validación de formularios y tratamiento de errores de API.

### Seguridad y robustez

- Cierre automático de sesiones expiradas.
- Sincronización de sesión y favoritos entre pestañas.
- Rutas administrativas protegidas.
- Validación de imágenes y formularios.
- Fallback para imágenes no disponibles.
- Navegación SPA compatible con recarga directa en Vercel.

## Tecnologías

### Frontend

- React 19
- Vite
- React Router
- Context API y hooks personalizados
- React Hook Form
- React Icons
- CSS responsive
- Oxlint

### Backend

- Node.js y Express
- MongoDB y Mongoose
- Autenticación JWT y bcrypt
- Cloudinary y Multer
- Helmet, CORS y rate limiting
- Node Test Runner

### Despliegue

- Vercel para el frontend
- Render para la API REST
- MongoDB Atlas para la base de datos
- Cloudinary para las imágenes administradas

## Arquitectura

```text
Navegador
   │
   ▼
React + Vite (Vercel)
   │  API REST / JSON
   ▼
Node.js + Express (Render)
   ├── MongoDB Atlas
   └── Cloudinary
```

El frontend consume la URL configurada en `VITE_API_URL`. Las operaciones privadas utilizan el token de sesión y el backend aplica autorización por rol y propiedad de los recursos.

## Instalación local

### Requisitos

- Node.js 20 o superior
- npm
- Una instancia local o desplegada de la API de DriveHub

### Configuración

```bash
git clone https://github.com/serxa92/DriveHub-FullStack-Frontend.git
cd DriveHub-FullStack-Frontend
npm install
```

Copia el archivo de ejemplo y configura la URL del backend:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8080
```

Inicia el entorno de desarrollo:

```bash
npm run dev
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Vite en modo desarrollo |
| `npm run build` | Genera la compilación de producción |
| `npm run lint` | Analiza el código con Oxlint |
| `npm run preview` | Sirve localmente la compilación generada |

## Principales endpoints

### Vehículos

```http
GET    /cars
GET    /cars/:id
POST   /cars
PUT    /cars/:id
DELETE /cars/:id
```

### Autenticación

```http
POST /auth/register
POST /auth/login
```

### Clientes y ventas

```http
GET|POST|PUT|DELETE /clients
GET|POST|PUT|DELETE /sales
```

Las operaciones de escritura y administración requieren autenticación y los permisos correspondientes.

## Imágenes y licencias

Las imágenes locales de demostración proceden de Wikimedia Commons. La autoría y licencia de cada recurso se documentan en [`IMAGE_CREDITS.md`](./IMAGE_CREDITS.md).

## Autor

**Sergio Agulla**

Proyecto final de Máster en Desarrollo Full-Stack.
