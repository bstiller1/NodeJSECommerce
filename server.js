// import required modules
const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();
// Middleware to parse incoming JSON Data
app.use(express.json());

// Config the MySQL Connection Pool
// Pools are better for performance with multiple connections
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ROUTE: GET /products - Get all products
app.get('/products', (req, res) => {
    const sql =  'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err){
            // log the error and return a 500 status code
            console.error(err);
            return res.status(500).json({ error: 'Databse query failed' });
        }
        // send the results back as JSON
        res.json(results);
    });
});
// ROUTE: POST /products - Add a new product
app.post('/products', (req, res) => {
    // Destructure data from the request body
    const { name, price, description } = req.body;
    // Basic Validation
    if (!name || !price){
        return res.status(400).json({ error: 'Name and Price are required.' });
    }
    const sql = 'INSERT INTO products (name, price, description) VALUES (? ,? ,?)';
    // Using placeholders (?) prevents SQL Injection
    db.query(sql, [name, price, description], (err, result) =>{
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create product' });
        }
        // Return a 201 Created Status with the new product id
        res.status(201).json({ message: 'Product added', productId: result.insertId });
    });
});
// ROUTE: GET /products/:id - Get a product by ID
app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [productId], (err, results) =>{
        if (err) return res.status(500).json({ error: 'Product not found' });
        if (results.length === 0){
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(results[0]);
    });
});
// Define the PORT from Enviroment Variables or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});
