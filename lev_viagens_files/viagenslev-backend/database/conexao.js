console.log("TENTANDO CONECTAR NO MYSQL");

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'viagenslev'
});

console.log("POOL MYSQL CRIADO");

module.exports = pool;