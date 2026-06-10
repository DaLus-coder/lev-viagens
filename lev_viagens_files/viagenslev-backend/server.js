const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const equipamentosRoutes = require('./routes/equipamentos');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensagem: 'Servidor ViagensLev funcionando!'
    });
});

app.use('/equipamentos', equipamentosRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});