const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require("./routes");
/* const bodyParser = require("body-parser"); */
const jwt = require('jsonwebtoken');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

//serve como middleware (body-parser) para resquisições REq REs
/* O método urlencoded dentro de body-parser diz ao body-parser para extrair dados do 
elemento <form> e adicioná-los à propriedade body no objeto request. Faça o teste, dê um console.
loge preencha o formulário, você deverá ver tudo no campo de formulário dentro do objeto: */
//abordagem de query no banco
// driver: utiliza as querys do banco tipo select* FROM ...
// query builder: linguagem de manipulação do banco em JS traduzido para query sql

mongoose.connect( "mongodb+srv://tcc:tcc123@omnistack-r3ccf.mongodb.net/tcc?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});


//vai entender corpo do body em json
/* app.use(express.json()); */
//


app.use(routes);

app.listen(process.env.PORT || 4444);
