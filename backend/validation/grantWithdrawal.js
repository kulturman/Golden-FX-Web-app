const { check , validationResult } = require('express-validator/check');

module.exports = () => {
    return [
        check('id').not().isEmpty().withMessage("L'indentifiant du client est obligatoire")
        .isNumeric().withMessage("L'identifiant est invalide"),
    ]
}