const sequelize = require('../util/db');
const DataTypes = require('sequelize');
const User = require('./user');

const Withdrawal = sequelize.define('withdrawal', {
        amount: DataTypes.DOUBLE,
        granted: DataTypes.BOOLEAN
    }, {}
);
Withdrawal.belongsTo(User , { foreignKey: 'userId' , as: 'user'});

module.exports = Withdrawal;
