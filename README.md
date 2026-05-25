# E-Commerce API — Backend 1

Proyecto final del curso **Backend 1: Desarrollo Avanzado** de CoderHouse.

## Stack tecnológico

- **Node.js** + **Express** — servidor HTTP
- **MongoDB Atlas** + **Mongoose** — base de datos cloud
- **Socket.io** — WebSockets para tiempo real
- **Express-Handlebars** — vistas server-side
- **FileSystem** — persistencia alternativa con JSON

## Instalación

```bash
npm install
```

Crear archivo `.env` en la raíz:
```
PORT=8080
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/ecommerce
```

```bash
npm start
```

## Endpoints API

### Productos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/products | Listar con filtros, paginación y orden |
| GET | /api/products/:pid | Obtener por ID |
| POST | /api/products | Crear producto |
| PUT | /api/products/:pid | Actualizar producto |
| DELETE | /api/products/:pid | Eliminar producto |

### Carritos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/carts | Crear carrito |
| GET | /api/carts/:cid | Ver carrito (con populate) |
| POST | /api/carts/:cid/products/:pid | Agregar producto |
| DELETE | /api/carts/:cid/products/:pid | Eliminar producto |
| PUT | /api/carts/:cid | Actualizar productos |
| PUT | /api/carts/:cid/products/:pid | Actualizar cantidad |
| DELETE | /api/carts/:cid | Vaciar carrito |

## Vistas

| Ruta | Descripción |
|------|-------------|
| /products | Catálogo con paginación y filtros |
| /products/:pid | Detalle del producto |
| /carts/:cid | Vista del carrito |
| /realtimeproducts | Actualización en tiempo real (WebSockets) |
