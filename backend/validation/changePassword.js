const { check , validationResult } = require('express-validator/check');

module.exports = () => {
    return [
        check('password').not().isEmpty().withMessage("Veuillez entrer un mot de passe"),
        check('newPassword').not().isEmpty().withMessage('Veuillez entrer un mot de passe')
        .isLength({ min: 6 , max: 25}).withMessage("Le nouveau mot de passe doit contenir entre 6 et 20 caractères"),
        check('passwordConfirmation').not().isEmpty().withMessage('Veuillez entrer un mot de passe')
    ]
}