const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log("DB_HOST =", process.env.DB_HOST);
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_NAME =", process.env.DB_NAME);
console.log("DB_PORT =", process.env.DB_PORT);
console.log("PASSWORD EXISTE =", !!process.env.DB_PASSWORD);

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

    console.log("ROTA /api/cards CHAMADA");

    try {

        const [rows] = await pool.query(
            'SELECT * FROM cards ORDER BY id DESC'
        );

        res.json(rows);

    } catch (err) {

        console.error("ERRO COMPLETO:", err);

        res.status(500).json({
            error: String(err),
            name: err?.name,
            message: err?.message,
            code: err?.code,
            stack: err?.stack
        });
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

const fs = require('fs');

if (!fs.existsSync('/data/uploads')) {
    fs.mkdirSync('/data/uploads', { recursive: true });
}

// Configuração de armazenamento de arquivos
const storage = multer.diskStorage({

    // pasta de destino
    destination: (req, file, cb) => {
        cb(null, '/data/uploads');
    },

    // nome do arquivo salvo
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


// inicialização do multer
const upload = multer({ storage });

// libera acesso público à pasta uploads
app.use('/uploads', express.static('/data/uploads'));


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
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    });
});


/* =========================================================
   INICIALIZAÇÃO DO SERVIDOR
========================================================= */

app.post('/api/admin/login', async (req, res) => {

    try {

        const { usuario, senha } = req.body;

        const [rows] = await pool.query(
            'SELECT * FROM admins WHERE usuario = ?',
            [usuario]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                error: 'Usuário inválido'
            });
        }

        const admin = rows[0];

        const senhaOk = await bcrypt.compare(
            senha,
            admin.senha
        );

        if (!senhaOk) {
            return res.status(401).json({
                error: 'Senha inválida'
            });
        }

        const token = jwt.sign(
            {
                id: admin.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            token
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

/* =========================================================
   ROTA PARA CADASTRO
========================================================= */

app.post('/api/auth/register', async (req, res) => {
    try {
        const { nome, email, senha, cidade, telefone } = req.body;

        const [user] = await pool.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        );

        if (user.length > 0) {
            return res.status(400).json({ error: "Email já existe" });
        }

        await pool.query(
            `INSERT INTO usuarios (nome, email, senha, cidade, telefone)
             VALUES (?, ?, ?, ?, ?)`,
            [nome, email, senha, cidade, telefone]
        );

        res.json({ message: "user created" });

    } catch (err) {

        console.error("ERRO CARDS:", err);

        res.status(500).json({
            error: err.message,
            code: err.code,
            sqlMessage: err.sqlMessage
        });
    }
});

/* =========================================================
   ROTA PARA LOGIN
========================================================= */

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
            [email, senha]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        res.json({
            message: "login ok",
            user: rows[0]
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {

    const { email, senha } = req.body;

    try {

        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
            [email, senha]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "Email ou senha inválidos" });
        }

        res.json({
            user: rows[0]
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/register', async (req, res) => {

    const { nome, email, senha, cidade, telefone } = req.body;

    try {

        await pool.query(
            `INSERT INTO usuarios (nome, email, senha, cidade, telefone)
             VALUES (?, ?, ?, ?, ?)`,
            [nome, email, senha, cidade, telefone]
        );

        res.json({ ok: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});