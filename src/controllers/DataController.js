const Client = require("../models/client");
const Company = require("../models/company");
const Service = require("../models/services");
const OS = require("../models/os");
const ObjectId = require("mongodb").ObjectId;
const countID = require("../models/counters");
const { findByIdAndUpdate } = require("../models/client");


async function getNextSequence(){
    const pegarValor = await countID.findById({ _id: "5f78aa2949dac2332cc2328a" })
    var numb= pegarValor.countId;
    const numbAtual = numb +1; 
    await countID.findByIdAndUpdate({ _id: "5f78aa2949dac2332cc2328a" }, { countId: numbAtual } )

    return numb;
}


module.exports = {

    //cria serviço
    async StoreService(req, res) {
        const userclient = req.userId;
        const { title } = req.body;
        const { description } = req.body;
        const { latitude } = req.body;
        const { longitude } = req.body;
        const { amountPayable } = req.body;

        const userDados = await Client.findById({ _id: userclient })
        const location = {
            type: "Point",
            coordinates: [latitude, longitude],
        };
        try {

            const service = await Service.create({
                title,
                description,
                location,
                UserClient: userclient,
                userName: userDados.name,
                userPhone: userDados.phone,
                status: "ABERTA",
                order: await getNextSequence(),
                amountPayable
            });
            res.json({
                status: "Criado com sucesso", service
                })
                console.log(service);
            // esse codigo de baixo eu comentei pq dava um pequeno erro no terminal, mas funciona com ele sem comentar, so coloquei por causa do codigo de cima.
                //    return res.json(service);
        } catch {
            return res.json({
                status: "error"
            });
        }
    },

    //lista um unico serviço 
    async ShowServices(req, res) {
        const { id } = req.params;
        const service = await Service.findById({  _id: id });
        console.log("Chegou na rota!!!")
        res.json(service);

    },
    //lista todos os serviços de quem solicitou 
    async indexService(req, res) {
        const idClient = req.userId;
        const response = await Service.find({UserClient:idClient});
        return res.json(response);

    },

    //edita um unico serviço
    async UpdateServices(req, res) {
        const { id } = req.params;
        const response = await Service.findOneAndUpdate({ _id: id }, req.body).then(function(){
            Service.findOne({_id: id}).then(function(response){
                
        return res.json(response);
            })
            res.json({
                status: "Alterado com sucesso!"
                })
        });
    },
    // deleta serviço
    async DeletService(req, res) {
        const { id } = req.params;
        const response = await Service.findOneAndDelete({ _id: id }, req.body).then(function(){
            Service.findOne({_id: id}).then(function(response){
                
        return res.json(response);
        
            })
            res.json({
                status: "Deletado com sucesso!"
                })
        });
    },
    //lista todos os serviços solicitados
    async indexServices( req, res) {
        const response = await Service.find({ status : "ABERTA"});
        response.reverse();
        return res.json(response);
    },

    //rota para gerar o stts da solicitação se esta em aberta
    async storeopenServices (req, res) {
        const { id } = req.params;
        const response = await findByIdAndUpdate({ _id: id }, { status : "ABERTA"}, { new: true } );
        return res.json(response);
    },
    //rota para gerar o stts da solicitação se esta em fechada
    async storecloseServices (req, res) {
        const { id } = req.params;
        const response = await findByIdAndUpdate({ _id: id }, { status : "FECHADA"}, { new: true } );
        return res.json(response);
    },
    //rota standby
    async StoreOS(req, res) {
        const {
            status,
            description,
            star,
            UserServices,
        } = req.body;
        const UserCompany = req.userId;

        console.log(req.body);
        try {
            const os = await OS.create({
                status,
                description,
                star,
                UserCompany,
                UserServices,
            });
            return res.json(os);
        } catch {
            return res.json({
                message: "error"
            });
        }

    }
};