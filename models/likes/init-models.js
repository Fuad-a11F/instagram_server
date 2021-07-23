var DataTypes = require("sequelize").DataTypes;
var _likes = require("./likes");

function initModels(sequelize) {
  var likes = _likes(sequelize, DataTypes);


  return {
    likes,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
