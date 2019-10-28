const router = require('express').Router();
const withdrawValidator = require('../validation/withdaw');
const grantWithdrawalValidator = require('../validation/grantWithdrawal');
const Withdrawal = require('../models/widthdrawal');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const User = require('../models/user');
const { getErrors , isEmpty } = require('../validation/util');
const { formatMoney } = require('../util/util');

router.post('/' , [ auth , withdrawValidator() ] , async (req , res) => {
    let errorResponse = getErrors(req);
    const userId = req.payload.user.id;
    const userTotalGains = await User.getUserGains(userId) - await User.getWithdrawalsTotal(userId);
    if(req.body.amount > userTotalGains) {
        errorResponse.amount = [`Le montant demandé est supérieur à vos avoirs (${formatMoney(userTotalGains)})`];
    }
    const withdrawal = await Withdrawal.findOne({
        where: { granted: false , userId }
    })
    if(withdrawal) {
        errorResponse.amount = [`Vous avez déjà une demande en cours de traitement`];
    }
    if (!isEmpty(errorResponse)) {
        return res.status(400).send(errorResponse);
    }

    return res.send(await Withdrawal.create({
        amount: req.body.amount,
        userId,
        granted: false
    }))
})

router.get('/' , [ auth ] , async (req , res) => {
    const user = req.payload.user;
    let data = null;
    if(user.isAdmin) {
        data = await Withdrawal.findAll({
            include: [
                { model : User , as : 'user' , attributes: ['name' , 'forename' , 'phone'] }
            ]
        })
    }
    else {
        data = await Withdrawal.findAll();
    }
    return res.send(data);
})

router.get('/my-withdrawals' , [ auth ] , async (req , res) => {
    const userId = req.payload.user.id;
    const withdrawals = await Withdrawal.findAll({ where: { userId }})
    return res.send(withdrawals);
})

router.get('/state/waiting' , [ auth , isAdmin ] , async (req , res) => {
    const withdrawals = await Withdrawal.findAll( {
            where: { granted: false },
            include: [
                { model : User , as : 'user' , attributes: ['name' , 'forename' , 'email' , 'phone'] }
            ]
        }
    )
    return res.send(withdrawals);
})

router.get('/state/:state' , [ auth ] , async (req , res) => {
    const withdrawals = await Withdrawal.findAll( {
            where:  { granted: req.params.state === 'granted' },
            include: [
                { model : User , as : 'user' , attributes: ['name' , 'forename' , 'email' , 'phone'] }
            ]
        }
    )
    return res.send(withdrawals);
})

router.get('/granted' , [ auth ] , async (req , res) => {
    return res.send(await Withdrawal.findAll());
})

router.get('/:id' , [ auth ] , async (req , res) => {
    let withdrawal = await Withdrawal.findByPk(req.params.id);
    if(!withdrawal) {
        return res.status(404).send({ message : "La ressource demandée n'existe pas" });
    }
    return res.send(withdrawal);  
})

router.post('/grant/:id' , [ auth , isAdmin , grantWithdrawalValidator() ] , async (req , res) => {
    let errorResponse = getErrors(req);
    if (!isEmpty(errorResponse)) {
        return res.status(400).send(errorResponse);
    }
    const withdrawal = await Withdrawal.findByPk(req.params.id);
    if(withdrawal) {
        if(withdrawal.granted) {
            return res.status(400).send({ message: 'Le retrait a déjà été accordé!' })
        }
        await withdrawal.update({
            granted: true
        })
        return res.send({
            id: withdrawal.id,
            message : 'Demande accordée avec succès'
        });
    }
    return res.status(404).send({
        message : "La ressource demandée n'existe pas"
    });
})

router.delete('/:id' , [auth , isAdmin] , async (req , res) => {
    const id = req.params.id;
    const withdrawal = await Withdrawal.findByPk(id);
    if(withdrawal.granted) {
        return res.status(400).send({'message' : 'Vous ne pouvez pas supprimer cette demande'});
    }
    await withdrawal.destroy();
    return res.send({
        'message' : "Demande supprimée avec succès"
    });
})
module.exports = router;