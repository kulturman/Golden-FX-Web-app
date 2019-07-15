const { check , validationResult } = require('express-validator/check');

module.exports = () => {
    return [
        check('loss').not().isEmpty()
        .isBoolean(),
        check('percentage').not().isEmpty().withMessage('Vous devez entrer un pourcentage valide')
        .isNumeric().withMessage('Vous devez entrer un pourcentage valide'),
    ]
}