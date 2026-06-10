const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./database/conexao');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());


/* =========================================================
   TESTE DE SERVIDOR
========================================================= */

app.get('/', (req, res) => {
    res.json({ mensagem: 'Servidor ViagensLev funcionando!' });
});


/* =========================================================
   ROTAS - CARDS (READ)
========================================================= */

app.get('/api/cards', async (req, res) => {
    try {

        // Busca todos os cards ordenados do mais recente
        const [rows] = await pool.query(
            'SELECT * FROM cards ORDER BY id DESC'
        );

        res.json(rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================================================
   ROTAS - CARDS (CREATE)
========================================================= */

app.post('/api/admin/cards', async (req, res) => {
    try {

        const { titulo, descricao, imagem, categoria, botao_texto } = req.body;

        // Insere novo card no banco
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


/* =========================================================
   ROTAS - CARDS (UPDATE)
========================================================= */

app.put('/api/admin/cards/:id', async (req, res) => {
    try {

        const { id } = req.params;
        const { titulo, descricao, imagem, categoria, botao_texto } = req.body;

        // Atualiza card existente
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


/* =========================================================
   ROTAS - CARDS (DELETE)
========================================================= */

app.delete('/api/admin/cards/:id', async (req, res) => {
    try {

        const { id } = req.params;

        // Remove card do banco
        await pool.query(
            'DELETE FROM cards WHERE id=?',
            [id]
        );

        res.json({ message: "deleted" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* =========================================================
   UPLOAD DE IMAGEM (MULTER)
========================================================= */

const multer = require('multer');
const path = require('path');

// Configuração de armazenamento de arquivos
const storage = multer.diskStorage({

    // pasta de destino
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    // nome do arquivo salvo
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// inicialização do multer
const upload = multer({ storage });

// libera acesso público à pasta uploads
app.use('/uploads', express.static('uploads'));


/* =========================================================
   ROTA - UPLOAD DE IMAGEM
========================================================= */

app.post('/api/upload', upload.single('imagem'), (req, res) => {

    // valida se arquivo foi enviado
    if (!req.file) {
        return res.status(400).json({ error: "nenhum arquivo enviado" });
    }

    // retorna URL pública da imagem
    res.json({
        url: `http://localhost:3000/uploads/${req.file.filename}`
    });
});


/* =========================================================
   INICIALIZAÇÃO DO SERVIDOR
========================================================= */

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});