"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(transaction => {
            return Promise.all([
                queryInterface.addColumn("users", "amount", {
                    type: Sequelize.DOUBLE,
                    allowNull: false
                } , { transaction }),
                queryInterface.addColumn("users", "currentAmount", {
                    type: Sequelize.DOUBLE,
                    allowNull: false
                } , { transaction })
            ])
        })
        
    },

    down: (queryInterface) => {
        return queryInterface.sequelize.transaction(transaction => {
            return Promise.all([
                queryInterface.removeColumn('users' , 'amount' , { transaction }),
                queryInterface.removeColumn('users' , 'currentAmount' , { transaction })
            ])
        })
    }
};
