//index, show, store, update, destroy
const Client = require("../models/client");
const Company = require("../models/company");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authClient = require('./AUTH JWT/auth-client');
const authComapny = require('./AUTH JWT/auth-company');
const { update } = require("../models/client");
const client = require("../models/client");
const nodemailer = require("nodemailer");

const { host, port, user, pass } = require('../controllers/AUTH JWT/mailer.json');
let transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
        user,
        pass
    }
})
async function generateCode (){
var num = new Array(4); //criando vetor com 9 posições
for(var i=0;i<4;i++){ //laço para percorrer todo o vetor
	var randomico = Math.floor(Math.random()*10); //gerando número aleatório
	var existe=false; //para saber se o numero existe ou não no vetor
        for(var cont=0;cont<i;cont++){ //função que percorre o vetor até onde já tenha sido preenchido
            if(num[cont]==randomico){ //verifica se o item no vetor é igual ao gerado 
                existe=true; //se é igual a variável existe recebe verdadeiro
                break; //e o laço de verificação é interrompido
            }else{//se não é igual
                existe=false; //existe recebe falso
            }
        } //fim do laço que verifica a existência
	if(!existe){ //se existe é igual a false
		num[i]=randomico; //o indice do vetor recebe o número gerado
	}else{ //se é verdadeiro
		i--; //o índice é decrementado para que haja um novo teste
    }
}
return num;
}


module.exports = {
    async IndexHome(req, res) {

    },
    async StoreResertPasswordCompany(req, res) {
        const email = req.body.email;
        try {
        let user = await Company.findOne({ email })
                const newCode =Math.floor(Math.random() * (9999 - 1000) + 1000)
                const response = await Company.findByIdAndUpdate({ _id: user._id}, { tokenCode: newCode }, {new: true});
                transporter.sendMail({
                    from: "TECNICO24H <tecnico24h.com@gmail.com>",
                    to: email,
                    subject: "Suporte TECNICO24H.com",
                    text: "Ola, use codigo para resgate de sua senha",
                    html: "<h1> Code: " + newCode,
                }).then(message => {
                    console.log(message);
                    return res.send("Verifique o seu email, para obter o codigo de acesso!!!")
                    
                }).catch(err => {
                    console.log(err);
                });
            } catch {
                return res.send("Erro na verificação de email, tente novamente!!!")
            }
    },
    
    async StoreResertPasswordclient(req, res) {
        const email = req.body.email;
        console.log(email);
        try{
            let user = await Client.findOne({ email })
            const newCode = Math.floor(Math.random() * (9999 - 1000) + 1000)
            const response = await Client.findByIdAndUpdate({ _id: user._id}, { tokenCode: newCode }, {new: true});
            console.log(response)
            transporter.sendMail({
                from: "TECNICO24H <tecnico24h.com@gmail.com>",
                to: email,
                subject: "Suporte TECNICO24H.com",
                text: "Ola, use codigo para resgate de sua senha",
                html: "<h1> Code: " + newCode,
            }).then(message => {
                console.log(message);
                return res.send("Verifique o seu email, para obter o codigo de acesso!!!")
            }).catch(err => {
                console.log(err);
                return res.send("Erro na verificação de email, tente novamente!!!")
            });
        } catch{
            return res.send("Erro na validação de email, tente novamente!!!")
        }

    },
    async UpdateResertPasswordclient(req, res) {
        const { email } = req.body
        const { tokenCode } = req.body
        const { newPassword } = req.body
        const { password } = req.body

        var numb1 = Number(tokenCode);
        var numb2 = Number(newPassword);
        var numb3 = Number(password);
        console.log(email, numb1, numb2,numb3)
        try {
            const user = await client.findOne({ email: email}).select('+password');
            if ((numb1 === user.tokenCode) && (numb2 === numb3)){
                user.password = numb3;
                await user.save();
                console.log(user)
                await Client.findByIdAndUpdate({ _id: user._id}, { tokenCode: null }, {new: true});
                return res.json("Senha alterada com sucesso!!!")
            } else{
                return res.json("Token ou senha errada, tente novamente!!!")
            }
        } catch {
            console.log(err)
            return res.json("Erro tente novamente!!!")
        }
    },
    
    async UpdateResertPasswordcompany(req, res) {
        const { email } = req.body
        const { tokenCode } = req.body
        const { newPassword } = req.body
        const { password } = req.body
        var numb1 = Number(tokenCode);
        var numb2 = Number(newPassword);
        var numb3 = Number(password);
        console.log(email, numb1, numb2,numb3)

        try {
            const user = await Company.findOne({ email: email}).select('+password');
            if ((numb1 === user.tokenCode) && (numb2 === numb3)){
                user.password = numb3;
                await user.save();
                console.log(user)
                await Company.findByIdAndUpdate({ _id: user._id}, { tokenCode: null }, {new: true});
                return res.json("Senha alterada com sucesso!!!")
            } else{
                return res.json("Token ou senha errada, tente novamente!!!")
            }
        } catch {
            return res.json("Erro tente novamente!!!")
        }
    },

    async StoreLoginClient(req, res) {
        const {
            email,
            password
        } = req.body;
        let user = await Client.findOne({
            email
        }).select('+password');
        try {
        if (!await bcrypt.compare(password, user.password))
                return res.json({
                    "status": 'Senha incorreta'
                });

            let token = jwt.sign({
                _id: user._id
            }, authClient.secret, {
                expiresIn: 86400,
            });
            // const name = user.name
            console.log(user, {
                "user": "Client"
            }, user._id, token)
            return res.json({
                "token": "Bearer " + token,
                "status": "Login realizado com sucesso",
                "name": user.name
            });
        }  catch {
            return res.json({
                "status": 'Email não existe no banco!!!'
            });

        }


    },
    async StoreLoginCompany(req, res) {
        const {
            email,
            password
        } = req.body;

        try{
            let user = await Company.findOne({
                email
            }).select('+password');
            if (!await bcrypt.compare(password, user.password))
                return res.json({
                    "status": 'Senha incorreta!!!'
                });

            let token = jwt.sign({
                _id: user._id
            }, authComapny.secret, {
                expiresIn: 86400,
            });

            console.log(user, {
                "user": "Empresa"
            }, user._id, token)
            return res.json({
                "token": "Bearer " + token,
                "status": "Login realizado com sucesso",
                "name": user.name
            });
        }catch{
            return res.json({
                "status": 'Email não existe no banco!!!'
            });
        }

    },
/*
    async StoreLogin(req, res) {
        const {
            email,
            password
        } = req.body;
        console.log(req.body);
        //procura no banco as credenciais
        try {
            let user = await Client.findOne({
                email
            }).select('+password');
            if (!user) {
                let user = await Company.findOne({
                    email
                }).select('+password');
                if (!await bcrypt.compare(password, user.password))
                    return res.json({
                        "status": 'Senha incorreta!!!'
                    });

                let token = jwt.sign({
                    _id: user._id
                }, authComapny.secret, {
                    expiresIn: 86400,
                });

                console.log(user, {
                    "user": "Empresa"
                }, user._id, token)
                return res.json({
                    "token": "Bearer " + token,
                    "status": "Login realizado com sucesso",
                    "name": user.name
                });
            }
            if (!await bcrypt.compare(password, user.password))
                return res.json({
                    "status": 'Senha incorreta'
                });

            let token = jwt.sign({
                _id: user._id
            }, authClient.secret, {
                expiresIn: 86400,
            });
            // const name = user.name
            console.log(user, {
                "user": "Client"
            }, user._id, token)
            return res.json({
                "token": "Bearer " + token,
                "status": "Login realizado com sucesso",
                "name": user.name
            });

        } catch {
            return res.json({
                "status": 'Email não existe no banco!!!'
            });

        }

        */
    
    async DestroyLogin(req, res) {
        const token = req.headers.token
        //pego o token aqui do usuario logado 
        //console.log(req.headers)
        console.log("token: ", token);
        //ai aqui eu boto um null pra deletar e ja era,  entendeu sim senhor blz marrecote agora só ir pra parte to livre se quiser fazer comigo bora destruir esse login
        console.log(req.headers)
        return res.json({
            "TokenDestroyed": "Você não tem mais acesso, seu lindooo!!"
        })
        //construir a rota para destruir o login
    },
    async StoreClient(req, res) {
        // req.body: acessar o corpo da requisiçao (criaçao, ediçao )
        //req.query: acessar query params (filtros)
        //req.params: acessar route params (ediçao, delete)
        //        const name = req.body.email;
        const { name } = req.body;
        const { phone } = req.body;
        const { cpfcnpj } = req.body;
        const { locality } = req.body;
        const { address } = req.body;
        const { email } = req.body;
        const { password } = req.body;
        const { filename } = req.file;

        console.log(req.body);

        try {
            let client = await Client.findOne({
                email
            });
            if (!client) {
                let client = await Client.findOne({
                    cpfcnpj
                });
                if (!client) {
                    client = await Client.create({
                        name,
                        phone,
                        cpfcnpj,
                        locality,
                        address,
                        email,
                        password,
                        avatar: filename
                    })
                    return res.json(client);
                } else {
                    return res.json({
                        message: "esse CPF/CNPJ ja existe"
                    })
                }
            } else {
                return res.json({
                    message: "esse email ja existe"
                })
            }
        } catch {
            return res.json({
                message: "error"
            });
        }
    },
    //Trabalhar na recuperaçao da senha 
    async ShowClient(req, res) {
        try {
            const user_id = req.userId;
            console.log(user_id);
            const user = await Client.findById({
                _id: user_id
            });
            //deixa em branco o passwaord/varialvel
            //password= undefined;
            res.json(user);
        } catch {
            res.json({
                message: "Informaçao nao existe consultar o banco!!"
            });
        }
    },
    async UpdatClient(req, res) {
        try {
            console.log(req.body)
            const user_id = req.userId;
            Client.findByIdAndUpdate({ _id: user_id }, req.body).then(function () {
                Client.findOne({ _id: user_id }).then(function (client) {
                    res.send(client);
                })
            })
            res.json({
                status: "Dados alterados"
            })
            console.log('rota update client OK!!')
        } catch {
            return res.json({
                message: "error"
            });
        }
    },
    async StoreCompany(req, res) {
        const { name } = req.body;
        const { phone } = req.body;
        const { cpfcnpj } = req.body;
        const { locality } = req.body;
        const { evaluation } = req.body;
        const { address } = req.body;
        const { email } = req.body;
        const { password } = req.body;
        const { description } = req.body;
        const { specialization } = req.body;
        const { filename } = req.file;
        //            const { Data_company } = req.body;
        console.log(req.body);

        try {
            let companytest = await Company.findOne({
                email
            });
            if (!companytest) {
                let companytest = await Company.findOne({
                    cpfcnpj
                });
                if (!companytest) {
                    companytest = await Company.create({
                        name,
                        phone,
                        cpfcnpj,
                        locality,
                        evaluation,
                        address,
                        email,
                        password,
                        description,
                        specialization,
                        avatar: filename
                    })
                    console.log(req.body);
                    console.log(req.file);
                    return res.json(companytest);
                } else {
                    return res.json({
                        message: "esse CPF/CNPJ ja existe"
                    })
                }
            } else {
                return res.json({
                    message: "esse email ja existe"
                })
            }

        } catch {

            return res.json({
                message: "error"
            });
        }

    },
    async ShowCompany(req, res) {
        try {

            const user_id = req.userId;
            console.log(user_id);
            const user = await Company.findById({ _id: user_id });
            //deixa em branco o passwaord/varialvel
            password = undefined;
            res.json(user);
        } catch {
            res.json({
                message: "Informaçao nao existe consultar o banco!!"
            });
        }
    },
    async UpdatCompany(req, res) {
        const  user_id  = req.userId;
        const { name } = req.body;
        const { phone } = req.body;
        console.log(user_id)
        console.log(name)
        const response = await Company.findByIdAndUpdate({ _id: user_id }, req.body, {new:true});
        console.log('rota update company OK!!')
        res.json({
            status: "Dados atualizados com sucesso!!!"
        });
    },
    async StoreEvaluation(req, res) {
        const userCompany = req.params.id
        const {
            evaluation
        } = req.body;

        const user = await Company.findOne({
            _id: userCompany
        })
        console.log(user)
        if (!user.evaluation) {
            await Company.findOneAndUpdate({
                _id: userCompany
            }, {
                evaluation: evaluation
            })
            return res.json("Alterado")
        } else {

            var num1 = evaluation;
            var num2 = user.evaluation;
            var total = null;
            total = (num1 + num2) / 2;
            await Company.findOneAndUpdate({
                _id: userCompany
            }, {
                evaluation: total
            })
            return res.json("alterado com sucesso")
        }

    },
    async ShowcompanyClient(req, res) {
        try {
  
            const user_id = req.body._id;
            console.log(user_id); 
            const user = await Client.findOne({ _id:user_id });
            res.json(user);
        } catch {
            res.json({
                message: "Informaçao nao existe consultar o banco!!"
            });
        }
    },

    async updateAvatarclient (req, res){
        const  user_id = req.userId;
        const { filename } = req.file;

        const response = await Client.findByIdAndUpdate({ _id: user_id }, { avatar: filename}, {new:true})
        res.json({
            status: "Dados alterados com sucesso!!!"
        })

    },

    async updateAvatarcompany (req, res){
        const  user_id = req.userId;
        const { filename } = req.file;

        const response = await Client.findByIdAndUpdate({ _id: user_id }, { avatar: filename}, {new:true})
        res.json({
            status: "Dados alterados com sucesso!!!"
        })

    }

}