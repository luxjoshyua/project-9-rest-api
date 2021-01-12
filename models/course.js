"use strict";

const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter a title for your course",
          },
          notEmpty: {
            msg: "Please enter a title for your course",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter a description for your course",
          },
          notEmpty: {
            msg: "Please enter a description for your course",
          },
        },
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
        allowNull: false,
      },
    });
  };

  return Course;
};
