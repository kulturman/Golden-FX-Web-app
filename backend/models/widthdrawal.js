const sequelize = require('../util/db');
const DataTypes = require('sequelize');
const User = require('./user');

const Withdrawal = sequelize.define('withdrawal', {
        amount: DataTypes.DOUBLE,
        granted: DataTypes.BOOLEAN
    }, {}
);
Withdrawal.belongsTo(User , { foreignKey: 'userId' , as: 'user'});

Withdrawal.getWaitingWithdrawalsCount = async () => {
    return Withdrawal.findOne({
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'waitingWithdrawalsCount']],
        where: { granted: false },
        raw: true
    })
}

module.exports = Withdrawal;
