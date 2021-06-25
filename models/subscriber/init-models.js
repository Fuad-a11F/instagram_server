var DataTypes = require("sequelize").DataTypes;
var _subscribes = require("./subscribes");

function initModels(sequelize) {
  var subscribes = _subscribes(sequelize, DataTypes);

  subscribes.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(subscribes, { as: "subscribes", foreignKey: "user_id"});

  return {
    subscribes,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
