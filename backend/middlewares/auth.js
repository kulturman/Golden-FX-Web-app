const jwt = require('jsonwebtoken');

module.exports = async (req , res , next) => {
    const token = req.header('X-auth-token');
    if(!token)
        return res.status(401).send('Accès refusé, pas de jeton');
    try {
        const payload = await jwt.verify(token , process.env.JWT_SECRET_KEY);
        req.payload = payload;
        return next();
    }

    catch(err) {
        return res.status(403).send('Accès refusé, le jeton est invalide');
    }
}