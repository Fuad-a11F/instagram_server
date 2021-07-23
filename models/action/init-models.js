var DataTypes = require("sequelize").DataTypes;
var _action = require("./action");

function initModels(sequelize) {
  var action = _action(sequelize, DataTypes);


  return {
    action,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
