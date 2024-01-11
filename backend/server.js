const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const bcrypt = require('bcrypt'); // Encripta a senha
const saltRounds = 10;

const userController = require('./controller/userController');
const db = require('./database/database')
db.sync(() => console.log(`Banco de dados conectado: ${process.env.DB_NAME}`));

// Fazer login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    userController.getUser(username)
        .then(userData => {
            const hashCorreto = bcrypt.compareSync(password, userData.password); // true or false

            if (hashCorreto == true) {
                userData.isAdmin ? res.status(200).send({ success: true, isAdmin: true }) : res.status(200).send({ success: true, isAdmin: false });
            } else {
                res.status(500).send({ success: false, message: "Senha incorreta" })
            }
        })
        .catch(error => {
            res.status(500).send({ message: 'Erro interno ao buscar usuário' });
        });
});

// Cadastro de usuarios
app.post('/cadastro', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        userController.createUser({
            userName: req.body.userName,
            password: hash,
            isAdmin: req.body.isAdmin
        })
            .then((item) => res.send(item))
            .catch((err) => {
                console.log('Erro no cadastro do usuario', JSON.stringify(err))
                return res.status(400).send(err)
            });
    });
});

//Listar todos os usuarios
app.get('/cadastro', (req, res, next) => {
    userController.listUsers().then((items) => res.send(items))
        .catch((err) => {
            console.log('Erro na consulta dos usuários', JSON.stringify(err))
            return res.send(err)
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});