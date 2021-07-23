var DataTypes = require("sequelize").DataTypes;
var _favourite = require("./favourite");

function initModels(sequelize) {
  var favourite = _favourite(sequelize, DataTypes);


  return {
    favourite,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
