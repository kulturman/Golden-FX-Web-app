const { check , validationResult } = require('express-validator/check');

module.exports = () => {
    return [
        check('email').not().isEmpty().withMessage("L'adresse email est obligatoire")
        .isEmail().withMessage("L'adresse saisie est invalide"),
        check('name').not().isEmpty().withMessage('Le nom est obligatoire'),
        check('forename').not().isEmpty().withMessage('Le prénom est obligatoire'),
        check('profession').not().isEmpty().withMessage('La profession est obligatoire'),
        check('phone').not().isEmpty().withMessage('Le numéro de téléphone est obligatoire'),
        check('address').not().isEmpty().withMessage('L\'adresse est obligatoire'),
    ]
}