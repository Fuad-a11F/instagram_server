var DataTypes = require("sequelize").DataTypes;
var _chat = require("./chat");

function initModels(sequelize) {
  var chat = _chat(sequelize, DataTypes);


  return {
    chat,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
