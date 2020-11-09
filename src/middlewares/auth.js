const jwt = require('jsonwebtoken');
const authClient = require('../controllers/AUTH JWT/auth-client.json')
const authCompany = require('../controllers/AUTH JWT/auth-company.json')


const Client = require("../models/client");
const Company = require("../models/company");

function verifyJwtClient(req, res, next) {
    const authorization = req.headers.token;

    if (!authorization)
        return res.status(401).send({
            error: 'No token provided'
        });

    const parts = authorization.split(' ')
    if (!parts.length == 2)
        return res.status(401).send({
            error: 'Token error'
        });

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({
            error: 'Token malformatted'
        });

    jwt.verify(token, authClient.secret, (err, decoded) => {
        if (err)
            return res.status(401).send({
                error: 'Token invalid'
            });

        req.userId = decoded._id;
        console.log("User id: " + req.userId)
        next();
    })

}

function verifyJwtCompany(req, res, next) {
    const authorization = req.headers.token;

    if (!authorization)
        return res.status(401).send({
            error: 'No token provided'
        });

    const parts = authorization.split(' ')
    if (!parts.length == 2)
        return res.status(401).send({
            error: 'Token error'
        });

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({
            error: 'Token malformatted'
        });

    jwt.verify(token, authCompany.secret, (err, decoded) => {
        if (err)
            return res.status(401).send({
                error: 'Token invalid'
            });

        req.userId = decoded._id;
        console.log("User id: " + decoded._id)
        next();
    })

}

async function verifyJwtResertPassword(req, res, next) {
    const authorization = req.headers.token;


}

module.exports = {
    verifyJwtClient,
    verifyJwtCompany,
    verifyJwtResertPassword
};