"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("fundVariations", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            loss: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            percentage: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            fundAmount: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            amountWithVariation: {
                type: Sequelize.DOUBLE,
                allowNull: false
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
        return queryInterface.dropTable("fundVariations");
    }
};
