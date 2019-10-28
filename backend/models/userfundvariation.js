const sequelize = require("../util/db");
const DataTypes = require("sequelize");
const User = require("./user");
const Fundvariation = require('./fundvariation')

const UserFundVariation = sequelize.define(
    "userFundVariation",
    {
        fundVariationId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        amountVariationOnUserFund: DataTypes.DOUBLE,
        amountVariationOnUserGains: DataTypes.DOUBLE
    },
    {}
);

//UserFundVariation.belongsTo(User , { foreignKey: 'userId' , as: 'user'});
UserFundVariation.belongsTo(Fundvariation , { foreignKey: 'fundVariationId' , as: 'variation'});

UserFundVariation.getTotalGains = async () => {
    const result = await sequelize.query(
        `
        SELECT SUM(ufv.amountVariationOnUserGains) As totalGains FROM userFundVariations ufv
        INNER JOIN fundVariations fv ON ufv.fundVariationId = fv.id WHERE fv.loss = 0
    `,
        { type: sequelize.QueryTypes.SELECT }
    );
    const { totalGains } = result[0];
    return totalGains ? totalGains : 0;
};

UserFundVariation.getWithdrawalsTotal = async () => {
    const result = await sequelize.query(
        `
        SELECT SUM(w.amount) as totalWithdrawals FROM withdrawals
        w WHERE w.granted=1
    `,
        { type: sequelize.QueryTypes.SELECT }
    );
    const { totalWithdrawals } = result[0];
    return totalWithdrawals ? totalWithdrawals : 0;
};

module.exports = UserFundVariation;
