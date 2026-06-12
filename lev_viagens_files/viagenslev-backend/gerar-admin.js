const bcrypt = require("bcryptjs");

bcrypt.hash("SuaSenhaForte123", 10)
.then(console.log);