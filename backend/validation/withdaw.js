const { check , validationResult } = require('express-validator/check');

module.exports = () => {
    return [
        check('amount').not().isEmpty().withMessage('Vous devez entrer un montant valide')
        .isNumeric().withMessage('Vous devez entrer un montant valide'),
    ]
}