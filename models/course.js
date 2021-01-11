"use strict";

const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {}
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      estimatedTime: {
        type: DataTypes.STRING,
      },
      materialsNeeded: {
        type: DataTypes.STRING,
      },
      // needs to equal the id from the Users table
      // userId: {},
    },
    {
      sequelize,
    }
  );

  // One-to-one association between the Course and User models
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: "userId",
      },
    });
  };

  return Course;
};
