const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
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

module.exports = router;