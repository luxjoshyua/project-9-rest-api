"use strict";

const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  class User extends Model {}
  User.init(
    {
      // first name
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a first name",
          },
          notEmpty: {
            msg: "Please provide a first name",
          },
        },
      },
      // last name
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a last name",
          },
          notEmpty: {
            msg: "Please provide a last name",
          },
        },
      },
      // email address
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "This email address already exists",
        },
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
          notNull: {
            msg: "Please provide an email address",
          },
          notEmpty: {
            msg: "Please provide an email address",
          },
        },
      },
      // password
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a password",
          },
          notEmpty: {
            msg: "Please provide a password",
          },
        },
        set(val) {
          const hashedPass = bcrypt.hashSync(val, 10);
          this.setDataValue("password", hashedPass);
        },
      },
    },
    { sequelize }
  );

  // One-to-many association between User and Course models
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };

  return User;
};
