const router = require('express').Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/auth");
const User = require('../models/user');
const Misc = require('../models/misc');
const bcrypt = require('bcrypt');
const sequelize = require('../util/db');

router.get('/' , [ auth , isAdmin ] , async (req , res) => {
    const applications = await User.findAll({
        where: { activated: false }
    });
    return res.send(applications);
})

router.delete('/:id' , [ auth , isAdmin ] , async (req , res) => {
    const id = req.params.id;
    await User.destroy({
        where: { id , activated: false }
    })
    return res.send({ message: 'Demande en attente supprimée avec succès' });
})

router.put('/validate/:id' , [auth , isAdmin] , async (req , res) => {
    let user = await User.findOne({ where: { id: req.params.id } });
    const password = User.generatePassword();
    user.password = await bcrypt.hash(password , await bcrypt.genSalt(10));
    let transaction = await sequelize.transaction();
    try {
        user.update({
            password,
            activated: true,
            createdAt: Date.now()
        })
        if(!user.isAdmin) {
            const misc = await Misc.findOne();
            await misc.update({
                fundCurrentAmount : +misc.fundCurrentAmount + +user.amount,
                fundAmount : +misc.fundAmount + +user.amount,
            })
        }
        let message = `L'utilisateur ${user.email} a été validé avec succès,\n
            son mot de passe est: ${password}`;

        transaction.commit();
        return res.send({
            user,
            message
        });
    }

    catch(err) {
        if(err) transaction.rollback();
    }
})
module.exports = router;