var DataTypes = require("sequelize").DataTypes;
var _comments = require("./comments");

function initModels(sequelize) {
  var comments = _comments(sequelize, DataTypes);

  comments.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(comments, { as: "comments", foreignKey: "post_id"});
  comments.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(comments, { as: "comments", foreignKey: "user_id"});

  return {
    comments,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
