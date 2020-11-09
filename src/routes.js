const express = require('express');
const multer = require('multer');
const middlewares = require('../src/middlewares/auth');
const uploadConfig = require('./config/upload');
const SessionControlle = require("./controllers/SessionController");
const DataController = require("./controllers/DataController");
const routes = express.Router();

//vai inteceptar as requisições dos client e fazer a autorização
const verifyJwtClient = middlewares.verifyJwtClient;
const verifyJwtCompany = middlewares.verifyJwtCompany;

const upload = multer(uploadConfig);


//rota de inicio de sessao login duplpo
//routes.post('/signIn', SessionControlle.StoreLogin);
//login de cliente
routes.post('/sign-client', SessionControlle.StoreLoginClient);
//login de empresa
routes.post('/sign-company', SessionControlle.StoreLoginCompany);
//login cliente
routes.post('/client-signup', upload.single('thumbnail'), SessionControlle.StoreClient);
//cadastro empresa
routes.post('/company-signup', upload.single('thumbnail'), SessionControlle.StoreCompany);
//rota para solicitar o resert de senha 
routes.post('/resert-passwordclient', SessionControlle.StoreResertPasswordclient);
routes.post('/resert-passwordcompany', SessionControlle.StoreResertPasswordCompany);
//rota para alterar senha 
routes.post('/updatepasswordclient', SessionControlle.UpdateResertPasswordclient);
routes.post('/updatepasswordcompany', SessionControlle.UpdateResertPasswordcompany);
//rota para logoff
routes.delete('/logoff', SessionControlle.DestroyLogin);
//routes.delete('/logofff', verifyJwtCompany, SessionControlle.DestroyLogin);
//Cria um serviço
routes.post('/service', verifyJwtClient, DataController.StoreService);
//lista todas as solicitação do usuario
routes.get('/services', verifyJwtClient, DataController.indexService);
//lista todas as solicitação de TODOS os usuarios
routes.get('/list-service', verifyJwtCompany, DataController.indexServices);
//lista uma unica solicitação
routes.get('/listservice/?:id', verifyJwtClient, DataController.ShowServices);
//edita uma solicitação
routes.put('/updatservice/?:id', verifyJwtClient, DataController.UpdateServices);
//deletra uma solicitação
routes.delete('/deletservice/?:id', verifyJwtClient, DataController.DeletService);
//lista todos as solicitações
routes.post('/list-os', verifyJwtCompany, DataController.StoreOS);
//rota para avaliar a empresa/cliente
routes.put('/evaluation/:id', verifyJwtClient, SessionControlle.StoreEvaluation);
//rota de inicio sem autenticação
routes.get('/', SessionControlle.IndexHome);
//lista o perfil do cliente
routes.get('/perfilclient', verifyJwtClient, SessionControlle.ShowClient);
//lista o perfil de empresa
routes.get('/perfilcompany', verifyJwtCompany, SessionControlle.ShowCompany);
//edita perfil de cliente
routes.put('/perfilclient/edit', verifyJwtClient, SessionControlle.UpdatClient);
//edita perfil de empresa
routes.put('/perfilcompany/edit', verifyJwtCompany, SessionControlle.UpdatCompany);
//company visualiza perfil de client da O.S
routes.get('/visuclient', verifyJwtCompany, SessionControlle.ShowcompanyClient);
//rota para abrir e fechar o.s
routes.post('/sttsopen/:id', verifyJwtClient, DataController.storeopenServices);
routes.post('/sttsclose/:id', verifyJwtClient, DataController.storecloseServices);
//alterar avatar de cliente
routes.post('/upavatarclient', upload.single('thumbnail'),verifyJwtClient, SessionControlle.updateAvatarclient);
//alterar avatar empresa
routes.post('/upavatarcompany', upload.single('thumbnail'),verifyJwtCompany, SessionControlle.updateAvatarclient);


module.exports = routes;