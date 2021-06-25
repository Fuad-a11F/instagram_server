var DataTypes = require("sequelize").DataTypes;
var _search = require("../search");

function initModels(sequelize) {
  var search = _search(sequelize, DataTypes);

  search.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(search, { as: "searches", foreignKey: "user_id"});

  return {
    search,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
