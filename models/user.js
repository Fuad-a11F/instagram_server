const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    site: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    about_me: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    number: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hint: {
      type: DataTypes.BOOLEAN(),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
