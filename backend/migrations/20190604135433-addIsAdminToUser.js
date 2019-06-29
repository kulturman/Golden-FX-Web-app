'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('users' , 'isAdmin' , {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('users' , 'isAdmin');
    }
};
