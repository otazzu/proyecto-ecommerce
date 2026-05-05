# Kurisu Shop - Tienda E-Commerce de Figuras Anime

Plataforma e-commerce especializada en figuras y coleccionables de anime. Construida con React.js en el frontend y Python/Flask en el backend.

## Roles de Usuario

El sistema define dos roles con capacidades diferentes:

| Rol | Descripción |
|-----|-------------|
| **client** | Cliente habitual: puede navegar el catálogo, buscar productos, añadir al carrito y comprar |
| **seller** | Vendedor: puede crear, editar, habilitar/deshabilitar y gestionar sus propios productos |

> **Nota:** El rol **seller** no se puede crear desde la interfaz web. Debe crearse mediante una petición POST desde Postman (u otra herramienta HTTP) al endpoint de registro con rol `seller`. Ver sección [Crear usuario Seller desde Postman](#crear-usuario-seller-desde-postman).

## Tech Stack

**Backend:**
- Python 3.10+ con Flask
- SQLAlchemy (ORM)
- Flask-JWT-Extended (autenticación JWT)
- bcrypt (hash de contraseñas)
- Cloudinary (almacenamiento de imágenes)
- PostgreSQL (producción) / SQLite (desarrollo)

**Frontend:**
- React 18 con React Router DOM v6
- Vite 6
- Tailwind CSS v4 con tema oscuro personalizado
- Gestión de estado con useContext/useReducer

## Características

- Catálogo de productos con búsqueda, filtros y ordenación
- Gestión de productos exclusiva para vendedores (crear, editar, poner en oferta)
- Carrito de compras persistente (localStorage)
- Gestión de direcciones de envío
- Detalles técnicos de productos (fabricante, colección, serie anime, personaje)
- Sistema de ofertas y productos nuevos
- Carga de imágenes a Cloudinary
- Panel de administración Flask-Admin
- UI responsive con tema oscuro

---

### 1) Instalación del Backend

> Si usas Github Codespaces o Gitpod, esta plantilla ya viene con Python, Node y PostgreSQL instalados. Si trabajas localmente, asegúrate de tener Python 3.10, Node y un motor de base de datos instalado.

1. Instala las dependencias de Python:
   ```bash
   pipenv install
   ```

2. Crea un archivo `.env` basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Configura las variables de entorno en `.env`:

   | Variable | Descripción |
   |----------|-------------|
   | `DATABASE_URL` | Cadena de conexión a tu base de datos |
   | `JWT_SECRET_KEY` | Clave secreta para firmar tokens JWT |
   | `FLASK_APP_KEY` | Clave para Flask-Admin |
   | `CLOUDINARY_CLOUD_NAME` | Nombre de tu cuenta Cloudinary |
   | `CLOUDINARY_API_KEY` | API Key de Cloudinary |
   | `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |
   | `FLASK_APP=src/app.py` | |
   | `FLASK_DEBUG=1` | Modo desarrollo |

   Ejemplos de `DATABASE_URL`:

   | Motor | DATABASE_URL |
   |-------|--------------|
   | SQLite | `sqlite:////test.db` |
   | MySQL | `mysql://username:password@localhost:port/example` |
   | Postgres | `postgres://username:password@localhost:5432/example` |

4. Ejecuta las migraciones:
   ```bash
   pipenv run migrate
   pipenv run upgrade
   ```

5. Inicia el servidor backend (puerto 3001):
   ```bash
   pipenv run start
   ```

### 2) Instalación del Frontend

- Asegúrate de usar Node 20 y de que el backend esté corriendo correctamente.

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo (puerto 3000):
   ```bash
   npm run dev
   ```

---

## Crear usuario Seller desde Postman

El rol **seller** no está disponible en el formulario de registro de la web. Para crear un vendedor, envía una petición **POST** desde Postman al siguiente endpoint:

```
POST http://localhost:3001/api/user/signup/seller
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "user_name": "vendedor1",
  "first_name": "Nombre",
  "last_name": "Apellido",
  "email": "vendedor@example.com",
  "password": "tu_contraseña_segura"
}
```

**Respuesta esperada:** El usuario será creado con rol `seller` y podrá iniciar sesión para crear y gestionar productos.

---

### Deshacer una migración

```bash
pipenv run downgrade
```

### Insertar datos de prueba

Puedes automatizar la adición de registros editando `commands.py` en `./src/api` y luego ejecutar:

```bash
pipenv run insert-test-data
```

## Despliegue

Esta plantilla está lista para desplegarse en Render.com. Lee la [documentación oficial](https://4geeks.com/docs/start/deploy-to-render-com) para más detalles.
