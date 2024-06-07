const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '127.0.0.1',  // o 'localhost'
  user: 'marco',
  password: 'marco',
  database: 'visuales'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Endpoint para obtener todos los artículos
app.get('/articulo', (req, res) => {
  const sql = 'SELECT * FROM articulo';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
      return;
    }
    res.json(results);
  });
});

// Endpoint para insertar un nuevo artículo
app.post('/articulo', (req, res) => {
  const { folio_control, descripcion, numero_serie, marca, cantidad, precio, ubicacion, estado, fecha_registro, fecha_baja, razon_baja, responsable_id } = req.body;

  console.log('Received data:', req.body);  // Log para ver los datos recibidos

  if (!folio_control || !descripcion || !numero_serie || !marca || !cantidad || !precio || !ubicacion || !estado || !fecha_registro || !responsable_id) {
    res.status(400).send('Missing required fields');
    return;
  }

  const sql = 'INSERT INTO articulo (folio_control, descripcion, numero_serie, marca, cantidad, precio, ubicacion, estado, fecha_registro, fecha_baja, razon_baja, responsable_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [folio_control, descripcion, numero_serie, marca, cantidad, precio, ubicacion, estado, fecha_registro, fecha_baja, razon_baja, responsable_id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
      return;
    }
    res.json({ id: result.insertId, folio_control, descripcion, numero_serie, marca, cantidad, precio, ubicacion, estado, fecha_registro, fecha_baja, razon_baja, responsable_id });
  });
});

// Endpoint para subir los datos del archivo Excel
app.post('/upload', async (req, res) => {
  const data = req.body;

  data.forEach(async (item) => {
    const {
      folio_control,
      descripcion,
      numero_serie,
      marca,
      cantidad,
      precio,
      ubicacion,
      estado,
      fecha_registro,
      fecha_baja,
      razon_baja,
      responsable_id,
    } = item;

    const sql = 'INSERT INTO articulo (folio_control, descripcion, numero_serie, marca, cantidad, precio, ubicacion, estado, fecha_registro, fecha_baja, razon_baja, responsable_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    try {
      await db.query(sql, [folio_control, descripcion, numero_serie, marca, cantidad, precio, ubicacion, estado, fecha_registro, fecha_baja, razon_baja, responsable_id]);
    } catch (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error inserting data');
    }
  });

  res.status(200).send('Data inserted successfully');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
