const { check , validationResult } = require('express-validator/check');

module.exports = () => {
    return [
        check('email').not().isEmpty().withMessage('L\'adresse email est obligatoire'),
        check('password').not().isEmpty().withMessage('Le mot de passe est obligatoire'),
    ]
}