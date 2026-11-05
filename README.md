# API REST de productos — Semana 10

Servidor REST construido con Node.js, Express y MySQL para practicar arquitectura MVC, operaciones CRUD, consultas preparadas y pruebas HTTP.

## Requisitos

- Node.js 20 o superior y npm.
- MySQL 8+ (o MySQL incluido en XAMPP/Laragon).
- Postman, Insomnia o Thunder Client para las pruebas manuales.

## Instalación y configuración

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env` y ajusta usuario, contraseña, host y puerto de MySQL. No agregues `.env` al control de versiones.

3. Crea la base de datos y la tabla:

   ```bash
   mysql -u root -p < schema.sql
   ```

   También puedes abrir y ejecutar `schema.sql` desde phpMyAdmin o MySQL Workbench. El script crea `db_lab10` y la tabla `products`.

4. Inicia el servidor:

   ```bash
   npm start
   ```

   En desarrollo, `npm run dev` reinicia el proceso cuando cambian los archivos. El servidor escucha en `http://localhost:3000` (o en el valor de `PORT`).

## Modelo de producto

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | entero autoincremental | Identificador único |
| `name` | texto, máximo 120 caracteres | Obligatorio, no vacío |
| `description` | texto o `null` | Opcional, máximo 5000 caracteres |
| `price` | decimal | Obligatorio, mayor o igual a 0, máximo dos decimales |
| `stock` | entero | Opcional, predeterminado a 0, mayor o igual a 0 |
| `created_at`, `updated_at` | fecha y hora | Administrados por MySQL |

## Endpoints

Todos los errores tienen forma `{ "error": "mensaje" }`. Los cuerpos de POST y PUT deben enviarse como JSON con `Content-Type: application/json`. Las consultas usan `mysql2/promise` con un pool y parámetros preparados.

| Método y ruta | Propósito | Respuesta satisfactoria |
|---|---|---|
| `GET /health` | Comprobar que el servidor está activo | `200` y `{ "status": "ok" }` |
| `GET /api/products` | Listar productos | `200` y un arreglo JSON |
| `GET /api/products/:id` | Consultar un producto | `200` y el producto |
| `POST /api/products` | Crear un producto | `201` y el producto creado |
| `PUT /api/products/:id` | Reemplazar los campos editables del producto | `200` y el producto actualizado |
| `DELETE /api/products/:id` | Eliminar físicamente un producto | `200` y un mensaje |

Ejemplo de cuerpo para POST y PUT:

```json
{
  "name": "Teclado",
  "description": "Teclado mecánico",
  "price": 49.9,
  "stock": 10
}
```

En PUT, `name` y `price` son obligatorios; `description` omitido se restablece a `null` y `stock` omitido a `0`. Los identificadores inválidos devuelven `400`, los recursos inexistentes `404`, el tipo de contenido incorrecto `415` y los errores internos `500`. No se exponen trazas al cliente.

## Pruebas

- Ejecuta las pruebas unitarias de validación con `npm test`.
- Con MySQL activo y `schema.sql` aplicado, ejecuta `npm run test:integration` para comprobar listar, crear, consultar, actualizar y eliminar usando la base configurada en `.env`. La prueba elimina el registro temporal que crea.
- Importa `postman/semana10-products.postman_collection.json` en Postman y ejecuta las solicitudes en orden. Configura `baseUrl` si es necesario. El POST conserva el identificador para GET, PUT y DELETE posteriores; se requiere el servidor y MySQL funcionando.
- En cada solicitud verifica el código HTTP y el JSON. La colección comprueba códigos, tipo de contenido y campos básicos del esquema.
