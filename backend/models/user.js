const sequelize = require("../util/db");
const DataTypes = require("sequelize");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const UserFundVariation = require("../models/userfundvariation");

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
        currentAmount: DataTypes.DOUBLE
    },
    {}
);
User.associate = function(models) {};

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
    if (process.env.NODE_ENV === "production") {
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
        } / 100)`;
    } else {
        if (variation.realPercentage !== 0) {
            sql = `UPDATE users SET currentAmount = amount`;
        } else {
            sql = `UPDATE users SET currentAmount = currentAmount + (currentAmount * ${
                variation.percentage
            } / 100)`;
        }
    }
    return await sequelize.query(sql, {
        type: sequelize.QueryTypes.BULKUPDATE
    });
};

User.updateUsersFundVariationsAndAmount = async variation => {
    let user;
    let transaction = await sequelize.transaction();
    const users = await User.findAll({
        where: { isAdmin: false }
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
            console.log('variation' , variation);
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
