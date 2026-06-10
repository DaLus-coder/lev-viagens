const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./database/conexao');

const app = express();

app.use(cors());
app.use(express.json());

/* TESTE */
app.get('/', (req, res) => {
    res.json({ mensagem: 'Servidor ViagensLev funcionando!' });
});

/* GET */
app.get('/api/cards', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM cards ORDER BY id DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* CREATE */
app.post('/api/admin/cards', async (req, res) => {
    try {
        const { titulo, descricao, imagem, categoria, botao_texto } = req.body;

        await pool.query(
            `INSERT INTO cards (titulo, descricao, imagem, categoria, botao_texto)
             VALUES (?, ?, ?, ?, ?)`,
            [titulo, descricao, imagem, categoria, botao_texto]
        );

        res.json({ message: "created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* UPDATE */
app.put('/api/admin/cards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, imagem, categoria, botao_texto } = req.body;

        await pool.query(
            `UPDATE cards 
             SET titulo=?, descricao=?, imagem=?, categoria=?, botao_texto=?
             WHERE id=?`,
            [titulo, descricao, imagem, categoria, botao_texto, id]
        );

        res.json({ message: "updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* DELETE */
app.delete('/api/admin/cards/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            'DELETE FROM cards WHERE id=?',
            [id]
        );

        res.json({ message: "deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//upload image
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

app.post('/api/upload', upload.single('imagem'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "nenhum arquivo enviado" });
    }

    res.json({
        url: `http://localhost:3000/uploads/${req.file.filename}`
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});