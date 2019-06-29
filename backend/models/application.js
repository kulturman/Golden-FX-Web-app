'use strict';
module.exports = (sequelize, DataTypes) => {
  const application = sequelize.define('application', {
    name: DataTypes.STRING,
    forename: DataTypes.STRING,
    email: DataTypes.STRING,
    profession: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    amount: DataTypes.DOUBLE
  }, {});
  application.associate = function(models) {
    // associations can be defined here
  };
  return application;
};