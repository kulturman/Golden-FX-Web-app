'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn('users' , 'godFatherId' , {
        type: Sequelize.INTEGER,
        allowNull: true
      })
      await queryInterface.addColumn('users' , 'activated' , {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      })
      await queryInterface.addColumn('users' , 'accountNumber' , {
        type: Sequelize.STRING,
        allowNull: true
      })
      await queryInterface.addColumn('users' , 'institutionName' , {
        type: Sequelize.STRING,
        allowNull: true
      })
      await queryInterface.addColumn('users' , 'identityProof' , {
        type: Sequelize.STRING,
        allowNull: true
      })
      await queryInterface.addConstraint("users" , ["godFatherId"] , {
        type: "foreign key",
        references: {
            table: 'users',
            field: 'id'
        },
        transaction
      });
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('users' , 'godFatherId')
  }
};
