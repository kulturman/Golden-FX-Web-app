const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const loginValidador = require('../validation/login');
const registerValidator = require('../validation/register');
const updateValidator = require('../validation/update');
const changePasswordValidator = require('../validation/changePassword');
const User = require('../models/user');
const FundVariation = require('../models/fundvariation');
const Misc = require('../models/misc');
const Withdrawal = require('../models/widthdrawal');
const UserFundVariation = require('../models/userfundvariation');
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

router.post('/register' , [ auth , registerValidator() ] , async (req , res) => {
    let errorResponse = getErrors(req);
    let email = req.body.email || 'null';
    let user = await User.findOne({ where: { email , deleted: false } });
    let loggedUser = req.payload.user;
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
        'country' , 'address' , 'isAdmin' , 'amount',
        'accountNumber' , 'institutionName' , 'identityProof'
    ]);
    user.activated = loggedUser.isAdmin;
    if(!user.amount) {
        user.amount = 0;
    }
    user.currentAmount = user.amount;
    const password = User.generatePassword();
    user.password = await bcrypt.hash(password , await bcrypt.genSalt(10));
    if(!loggedUser.isAdmin) {
        user.godFatherId = loggedUser.id;
    }
    let transaction = await sequelize.transaction();
    try {
        const createdUser = await User.create(user);
        if(!user.isAdmin && loggedUser.isAdmin) {
            const misc = await Misc.findOne();
            await misc.update({
                fundCurrentAmount : +misc.fundCurrentAmount + +user.amount,
                fundAmount : +misc.fundAmount + +user.amount,
            })
        }
        let message = loggedUser.isAdmin ? `L'utilisateur ${user.email} a été créé avec succès\n
            Le mot de passe est: ${password}
        ` : 'La demande a été transmise avec succès, elle sera traitée par l\'admin dès que possible'

        transaction.commit();
        return res.send({
            user: createdUser,
            message
        });
    }

    catch(err) {
        if(err) transaction.rollback();
    }
})

router.post('/reinitilize-password/:id' , [auth , isAdmin] , async (req , res) => {
    const user = await User.findByPk(req.params.id);
    const password = User.generatePassword();
    await user.update({
        password: await bcrypt.hash(password , await bcrypt.genSalt(10))
    })
    return res.send({
        message: `Le mot de passe a été réinitialisé avec succès\n
            Le nouveau mot de passe est: ${password}`
    });
})

router.get('/dashboard' , auth , async (req , res) => {
    const { user } = req.payload;
    const userId = user.id;
    const usersCount = await User.findOne({
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'usersCount']],
        where: { isAdmin: false , deleted: false , activated: true }
    });
    const misc = await Misc.findOne();
    const lastVariations = await FundVariation.findAll({
        attributes: ['percentage' , 'date' , 'loss'],
        limit: 10,
        order: [
            ['date' , 'DESC']
        ]
    });
    const data = {
        usersCount: usersCount.dataValues.usersCount,
        lastVariations,
        fundCurrentAmount: misc.dataValues.fundCurrentAmount,
        fundAmount: misc.dataValues.fundAmount,
        graphData: await FundVariation.getDataForGraphByDays('2019-01-01')
    }

    if(!user.isAdmin) {
        const userCurrentFundAmount = await User.findOne({
            where: { id: userId },
            attributes: ['amount' , 'currentAmount']
        });
        data.userCurrentFundAmount = userCurrentFundAmount.dataValues.currentAmount,
        data.userFundAmount = userCurrentFundAmount.dataValues.amount,
        data.userTotalGains = await User.getUserGains(userId) - await User.getWithdrawalsTotal(userId);
    }

    else {
        const { waitingWithdrawalsCount } = await Withdrawal.getWaitingWithdrawalsCount();
        data.waitingWithdrawalsCount = waitingWithdrawalsCount;
        data.currentTotalGainsMinusWithdrawals = await UserFundVariation.getTotalGains()
            await UserFundVariation.getWithdrawalsTotal()
    }
    return res.send(data);
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


router.get('/my-withdrawals' , auth , async (req , res) => {
    const id = req.payload.user.id;
    const withdrawals = await Withdrawal.findAll({ where: { userId: id }});
    return res.send(withdrawals);
})

router.get('/' , [ auth , isAdmin ] , async (req , res) => {
    const users = await User.findAll({
        attributes: [
            'id' , 'name' , 'forename' , 'email' , 'phone' , 'profession' ,
             'isAdmin' , 'createdAt' , 'amount' , 'currentAmount' , 'identityProof',
             'accountNumber' , 'institutionName'
        ],
        where: { deleted: false , activated: true }
    });
    return res.send(users);
})

router.get('/:id' , [ auth , isAdmin ] , async (req , res) => {
    return res.send(await User.findByPk(req.params.id));
})

router.delete('/:id' , [ auth , isAdmin ] , async (req , res) => {
    const user = await User.findByPk(req.params.id);
    const misc = await Misc.findOne();
    let transaction = await sequelize.transaction();
    if(user.isAdmin || !user.activated) {
        await user.destroy();
    }
    else {
        try {
            await user.update({
                deleted: true
            } , { transaction });
            await misc.update({
                fundAmount: misc.fundAmount - user.currentAmount,
                fundCurrentAmount: misc.fundCurrentAmount - user.currentAmount
            } , { transaction })
            transaction.commit();
        }

        catch(err) {
            if(err) transaction.rollback();
        }
    }
    return res.send(user);
})

router.put('/:id' , [ updateValidator() , auth , isAdmin ] , async (req , res) => {
    let errorResponse = getErrors(req);
    if (!isEmpty(errorResponse)) {
        return res.status(400).send(errorResponse);
    }
    const updatedInfos = _.pick(req.body , [
        'name' , 'forename' , 'email' , 'profession' , 'phone' , 'address' , 'amount'
        , 'accountNumber' , 'institutionName'
    ]);
    if(req.body.identityProof) {
        updatedInfos.identityProof = req.body.identityProof;
    }
    /*const emailAlreadyUsed = User.find({
        email: updatedInfos.email
    })*/
    const user = await User.findByPk(req.params.id);
    let transaction = await sequelize.transaction();
    if(!user.isAdmin && (!req.body.amount || isNaN(req.body.amount))) {
        errorResponse.amount = ['Vous devez entrer un montant valide'];
        return res.status(400).send(errorResponse);
    }
    if(!user.isAdmin) {
        const amountDiff = updatedInfos['amount'] - user.amount;
        const misc = await Misc.findOne();
        if(amountDiff < 0 && -amountDiff > user.currentAmount) {
            errorResponse.amount = [
                `Impossible de faire cette opération, le montant actuel du client est inférieur
                à la somme que vous essayer "d'enlever"
                `
            ];
            return res.status(400).send(errorResponse);
        }
        try {
            updatedInfos['currentAmount'] = user.currentAmount + amountDiff;
            await user.update({
                ...updatedInfos
            } , { transaction });
            await misc.update({
                fundAmount: misc.fundAmount + amountDiff,
                fundCurrentAmount: misc.fundCurrentAmount + amountDiff
            } , { transaction })
            transaction.commit();
            return res.send(user);
        }

        catch(err) {
            if(err) transaction.rollback();
        }
    }
    return res.send(await user.update(updatedInfos));
})

router.get('/god-sons/:state' , [auth] , async (req , res) => {
    const { user } = req.payload;
    return res.send(await User.findAll({
        where: {
            activated: req.params.state === 'active',
            godFatherId: user.id,
        }
    }))
})
module.exports = router;