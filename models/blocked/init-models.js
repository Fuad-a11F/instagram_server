var DataTypes = require("sequelize").DataTypes;
var _blocked = require("./blocked");

function initModels(sequelize) {
  var blocked = _blocked(sequelize, DataTypes);


  return {
    blocked,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
