const jwt = require('jsonwebtoken');

const authClient = require('./auth-client');

const authCompany = require('./auth-company');

module.exports =
    async function generateTokenCompany(params = {}) {
            return jwt.sign(params, authCompany.secret, {
                expiresIn: 86400,
            });
        },

        function generateTokenClient(params = {}) {
            return jwt.sign(params, authClient.secret, {
                expiresIn: 86400,
            });
        }
