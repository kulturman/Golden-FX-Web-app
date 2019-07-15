"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("userFundVariations", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            fundVariationId: {
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            amountVariationOnUserFund: {
                type: Sequelize.DOUBLE
            },
            amountVariationOnUserGains: {
                type: Sequelize.DOUBLE
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("userFundVariations");
    }
};
