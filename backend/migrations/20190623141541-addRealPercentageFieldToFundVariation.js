"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('fundVariations' , 'realPercentage' , {
            type: Sequelize.DOUBLE
        });
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('fundVariations' , 'realPercentage');
    }
};
