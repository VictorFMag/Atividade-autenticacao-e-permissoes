const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const userController = require('./controller/userController');
const db = require('./database/database')
db.sync(() => console.log(`Banco de dados conectado: ${process.env.DB_NAME}`));

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    userController.getUser(username)
        .then(userData => {
            if (userData.password === password) {
                userData.isAdmin ? res.status(200).send({ success: true, isAdmin: true }) : res.status(200).send({ success: true, isAdmin: false });
            } else {
                res.status(500).send({ success: false, message: "Credenciais incorretas!" });
            };
        })
        .catch(error => {
            res.status(500).send({ message: 'Erro interno ao buscar usuário' });
        });
});

app.post('/cadastro', (req, res) => {
    userController.createUser({
        userName: req.body.userName,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    })
        .then((item) => res.send(item))
        .catch((err) => {
            console.log('Erro no cadastro do usuario', JSON.stringify(err))
            return res.status(400).send(err)
        });
});

app.get('/cadastro', (req, res, next) => {
    userController.listUsers().then((items) => res.send(items))
        .catch((err) => {
            console.log('Erro na consulta do usuário', JSON.stringify(err))
            return res.send(err)
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});