const jwt = require('jsonwebtoken');

module.exports = async (req , res , next) => {
    const isAdmin = req.payload.user.isAdmin;
    if(!isAdmin)
        return res.status(401).send('Accès refusé , pas admin!');
    return next();
}