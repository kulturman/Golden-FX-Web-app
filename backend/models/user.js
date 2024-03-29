const sequelize = require("../util/db");
const DataTypes = require("sequelize");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const UserFundVariation = require("../models/userfundvariation");
const { formatDateEnglish } = require('../util/util');

const User = sequelize.define(
    "user",
    {
        forename: DataTypes.STRING,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        profession: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN,
        amount: DataTypes.DOUBLE,
        currentAmount: DataTypes.DOUBLE,
        deleted: DataTypes.BOOLEAN,
        activated: DataTypes.BOOLEAN,
        godFatherId: DataTypes.INTEGER,
        accountNumber: DataTypes.STRING,
        institutionName: DataTypes.STRING,
        identityProof: DataTypes.STRING
    },
    {}
);
User.belongsTo(User , { foreignKey: 'godFatherId' , as: 'godFather'});

User.prototype.generateToken = function() {
    return jwt.sign(
        {
            id: this.id,
            user: _.pick(this, ["name", "forename", "email", "id", "isAdmin"])
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2 days" }
    );
};

User.generatePassword = function() {
    if (process.env.NODE_ENV === "development") {
        return "123456";
    }
    return Math.random()
        .toString(36)
        .slice(-10);
};

User.getUserGains = async id => {
    const result = await sequelize.query(
        `
        SELECT SUM(ufv.amountVariationOnUserGains) As totalGains FROM userFundVariations ufv
        INNER JOIN fundVariations fv ON ufv.fundVariationId = fv.id INNER JOIN users u on u.id =
        ufv.userId WHERE fv.loss = 0 AND u.id = ${id}
    `,
        { type: sequelize.QueryTypes.SELECT }
    );
    const { totalGains } = result[0];
    return totalGains ? totalGains : 0;
};

User.getWithdrawalsTotal = async id => {
    const result = await sequelize.query(
        `
        SELECT SUM(w.amount) as totalWithdrawals FROM withdrawals
        w INNER JOIN users u on u.id = w.userId WHERE w.granted=1 AND u.id=${id}
    `,
        { type: sequelize.QueryTypes.SELECT }
    );
    const { totalWithdrawals } = result[0];
    return totalWithdrawals ? totalWithdrawals : 0;
};

User.updateUsersCurrentAmount = async variation => {
    let sql = null;
    if (variation.loss) {
        sql = `UPDATE users SET currentAmount = currentAmount - (currentAmount * ${
            variation.percentage
        } / 100) WHERE deleted=0 AND activated=1 AND createdAt <= "${formatDateEnglish(variation.date)} 23:59:59"`;
    } else {
        if (variation.realPercentage !== 0) {
            sql = `UPDATE users SET currentAmount = amount WHERE deleted=0`;
        } else {
            sql = `UPDATE users SET currentAmount = currentAmount + (currentAmount * ${
                variation.percentage
            } / 100) WHERE deleted=0 AND activated=1 AND createdAt <= "${formatDateEnglish(variation.date)} 23:59:59"`;
        }
    }
    return await sequelize.query(sql, {
        type: sequelize.QueryTypes.BULKUPDATE
    });
};

User.updateUsersFundVariationsAndAmount = async variation => {
    let user;
    let transaction = await sequelize.transaction();
    const date = variation.date;
    date.setHours(23 , 59 , 59 , 999);
    const users = await User.findAll({
        where: {
            isAdmin: false , deleted: false , activated: true , createdAt: {
                [DataTypes.Op.lte]: date
            }
        }
    });

    try {
        const userFundVariations = [];
        users.forEach(item => {
            user = item.get({ plain: true });
            let amountVariationOnUserFund = null;
            let amountVariationOnUserGains = null;
            if (variation.loss) {
                amountVariationOnUserGains = 0;
                amountVariationOnUserFund =
                    (variation.percentage * user.currentAmount) / 100;
            } else {
                amountVariationOnUserGains =
                    (variation.realPercentage * user.currentAmount) / 100;
                if (variation.realPercentage.toString() !== "0") {
                    let variationPercentageOnFund =
                        variation.realPercentage - variation.percentage;
                    amountVariationOnUserFund =
                        (variationPercentageOnFund * user.currentAmount) / 100;
                } else {
                    amountVariationOnUserFund =
                        (variation.percentage * user.currentAmount) / 100;
                }
            }
            userFundVariations.push({
                fundVariationId: variation.id,
                userId: user.id,
                amountVariationOnUserFund,
                amountVariationOnUserGains
            });
        });
        await UserFundVariation.bulkCreate(userFundVariations , { transaction });
        await User.updateUsersCurrentAmount(variation);
        transaction.commit();
    } catch (err) {
        if (err) transaction.rollback();
    }
};
module.exports = User;
