const winston = require('winston');

module.exports = (ex , req , res , next) => {
    winston.error(ex.message);
    return res.status(500).send('Une erreur s\'est produite, veuillez en informer l\'administrateur');
}