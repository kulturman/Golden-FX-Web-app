const sequelize = require("../util/db");
const DataTypes = require("sequelize");

const Application = sequelize.define('application', {
  name: DataTypes.STRING,
  forename: DataTypes.STRING,
  email: DataTypes.STRING,
  profession: DataTypes.STRING,
  phone: DataTypes.STRING,
  address: DataTypes.STRING,
  amount: DataTypes.DOUBLE
}, {})
module.exports = Application;