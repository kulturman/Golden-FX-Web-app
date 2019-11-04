"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable("withdrawals", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        amount: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER
        },
        granted: {
          type: Sequelize.BOOLEAN
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
      await queryInterface.addConstraint("withdrawals" , ["userId"] , {
        type: "foreign key",
        references: {
            table: 'users',
            field: 'id'
        },
        transaction
      });
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("withdrawals");
  }
};
