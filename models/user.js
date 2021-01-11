"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      emailAddress: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      // modelName: "User",
    }
  );

  // One-to-many association between User and Course models
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
      },
    });
  };

  return User;
};
