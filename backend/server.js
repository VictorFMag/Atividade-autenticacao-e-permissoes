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

    const userData = userController.getUser(username);

    // Verifique as credenciais (pode ser feito de forma mais segura no ambiente de produção)
    if (userData && userData.password === password) {
        // Envia uma resposta de sucesso
        if (userData.isAdmin) {
            res.status(200).json({ success: true, isAdmin: true });
        } else {
            res.status(200).json({ success: true, isAdmin: false });
        }
    } else {
        // Envie uma resposta de erro
        res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});