var DataTypes = require("sequelize").DataTypes;
var _posts = require("./posts");

function initModels(sequelize) {
  var posts = _posts(sequelize, DataTypes);

  posts.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(posts, { as: "posts", foreignKey: "user_id"});

  return {
    posts,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
