"use strict";

const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      // first name
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A first name is required",
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
            msg: "A last name is required",
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
          msg: "The email you entered already exists",
        },
        validate: {
          notNull: {
            msg: "An email is required",
          },
          isEmail: {
            msg: "Please provide a valid email address",
          },
          notEmpty: {
            msg: "Please provide an email",
          },
        },
      },
      // password
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A password is required",
          },
          notEmpty: {
            msg: "Please provide a password",
          },
          len: {
            args: [8, 20],
            msg: "The password should be between 8 and 20 characters in length",
          },
        },
        set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue("confirmedPassword", hashedPassword);
        },
      },
    },
    {
      sequelize,
    }
  );

  // One-to-many association between User and Course models
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
        allowNull: true,
      },
    });
  };

  return User;
};
