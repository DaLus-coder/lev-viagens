const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensagem: 'Servidor ViagensLev funcionando!'
    });
});

// PRIMEIRA ROTA
app.get('/equipamentos', (req, res) => {
    res.json([
        {
            id: 1,
            nome: 'Scooter Elétrica',
            preco: 120
        },
        {
            id: 2,
            nome: 'Carrinho para Bebê',
            preco: 50
        },
        {
            id: 3,
            nome: 'Andador para Idoso',
            preco: 40
        }
    ]);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});