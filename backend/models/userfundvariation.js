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

module.exports = UserFundVariation;
