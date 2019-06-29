const sequelize = require("../util/db");
const DataTypes = require("sequelize");

const Misc = sequelize.define(
    "misc",
    {
        fundCurrentAmount: DataTypes.DOUBLE,
        fundMaxAmount: DataTypes.DOUBLE,
        fundAmount: DataTypes.DOUBLE
    },
    {}
);

module.exports = Misc;