# eCommerce Products API

## Pre-requisities

MySQL Server Running<br>
Postman - For testing Routes

## Installation

`npm install`<br>
`npm start` or `node server.js`

## Routes

`GET: /products` - Get all products<br>
`GET: /products/:id` - Get product by id<br>
`POST: /products` - Add a product with JSON:<br>

```
{
  "name": "Mechanical Keyboard",
  "price": 89.99,
  "description": "RGB backlit with blue switches"
}
```
