const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const loginValidador = require('../validation/login');
const registerValidator = require('../validation/register');
const changePasswordValidator = require('../validation/changePassword');
const User = require('../models/user');
const FundVariation = require('../models/fundvariation');
const Misc = require('../models/misc');
const Withdrawal = require('../models/widthdrawal');;
const { getErrors , isEmpty } = require('../validation/util');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const sequelize = require('../util/db');

router.post('/login' , loginValidador() , async (req , res) => {
    let errorResponse = getErrors(req);
    if (!isEmpty(errorResponse)) {
        return res.status(400).send(errorResponse);
    }

    const user = await User.findOne({
        where: {email: req.body.email}
    });
    if(!user) {
        return res.status(404).send({
            email: ["Aucun utilisateur ne correspond à ces données"]
        });
    }

    if(await bcrypt.compare(req.body.password , user.password)) {
        return res.header('X-auth-token' , user.generateToken()).send({
            user,
            token: user.generateToken()
        });
    }
    return res.status(404).send({
        email: ["Aucun utilisateur ne correspond à ces données"]
    });
})

router.post('/register' , [ auth , isAdmin , registerValidator() ] , async (req , res) => {
    let errorResponse = getErrors(req);
    let email = req.body.email || 'null';
    let user = await User.findOne({ where: { email } });

    if(user) {
        errorResponse.email = ['Cette adresse email existe déjà'];
    }

    if(!req.body.isAdmin && (!req.body.amount || isNaN(req.body.amount))) {
        errorResponse.amount = ['Vous devez entrer un montant valide'];
    }
    if (!isEmpty(errorResponse)) {
        return res.status(400).send(errorResponse);
    }
    user = _.pick(req.body , [
        'name' , 'forename' , 'email' , 'profession' , 'phone' ,
        'country' , 'address' , 'isAdmin' , 'amount'
    ]);
    if(user.amount) {
        user.currentAmount = user.amount;
    }
    const password = User.generatePassword();
    user.password = await bcrypt.hash(password , await bcrypt.genSalt(10));
    let transaction = await sequelize.transaction();
    try {
        const createdUser = await User.create(user);
        const misc = await Misc.findOne();
        await misc.update({
            fundCurrentAmount : +misc.fundCurrentAmount + +user.amount,
            fundAmount : +misc.fundAmount + +user.amount,
        })
        transaction.commit();
        return res.send(createdUser);
    }

    catch(err) {
        if(err) transaction.rollback();
    }
})


router.get('/my-withdrawals' , auth , async (req , res) => {
    const id = req.payload.user.id;
    const withdrawals = await Withdrawal.findAll({ where: { userId: id }});
    return res.send(withdrawals);
})

router.get('/' , [ auth , isAdmin ] , async (req , res) => {
    const users = await User.findAll({
        attributes: ['id' , 'name' , 'forename' , 'email' , 'phone' , 'profession' , 'isAdmin' , 'createdAt' , 'amount']
    });
    return res.send(users);
})

router.get('/dashboard' , auth , async (req , res) => {
    const userId = req.payload.user.id;
    const usersCount = await User.findOne({
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'usersCount']],
        where: { isAdmin: false }
    });
    const misc = await Misc.findOne();
    const userCurrentFundAmount = await User.findOne({
        where: { id: userId },
        attributes: ['amount' , 'currentAmount']
    });
    const lastVariations = await FundVariation.findAll({
        attributes: ['percentage' , 'date' , 'loss'],
        limit: 10,
        order: [
            ['createdAt' , 'DESC']
        ]
    });
    const userTotalGains = await User.getUserGains(userId) - await User.getWithdrawalsTotal(userId);
    return res.send({
        usersCount: usersCount.dataValues.usersCount,
        lastVariations,
        fundCurrentAmount: misc.dataValues.fundCurrentAmount,
        fundAmount: misc.dataValues.fundAmount,
        userCurrentFundAmount: userCurrentFundAmount.dataValues.currentAmount,
        userFundAmount: userCurrentFundAmount.dataValues.amount,
        userTotalGains,
        graphData: await FundVariation.getDataForGraphByDays('2019-01-01')
    });
})

router.post('/change-password' , [ auth , changePasswordValidator() ] , async (req , res) => {
    const user = await User.findByPk(req.payload.user.id);
    let errorResponse = getErrors(req);
    if(!await bcrypt.compare(req.body.password , user.password)) {
        errorResponse.password = ['Le mot de passe saisi est incorrect'];
    }

    if(req.body.newPassword !== req.body.passwordConfirmation) {
        errorResponse.passwordConfirmation = ["Ne correspond pas au mot de passe saisi plus haut"];
    }

    if (!isEmpty(errorResponse)) {
        return res.status(400).send(errorResponse);
    }
    return res.send(await user.update({
        password: await bcrypt.hash(req.body.newPassword , await bcrypt.genSalt(10))
    }));
})
module.exports = router;