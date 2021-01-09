"use strict";

const express = require("express");
const { Course, User } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");

// construct router instance
const router = express.Router();

/**
 * GET
 *  - returns the currently authenticated user
 *  - returns 200 HTTP status code
 */
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  })
);

/**
 * POST
 *  - creates new user
 *  - sets Location header to "/"
 *  - returns 201 HTTP status code and no content
 */
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      // create new user
      await User.create(req.body);
      res
        .location("/")
        .status(201)
        // TODO: remember to remove this log before submitting for marking!
        .json({ message: "User successfully created" })
        .end();
    } catch (error) {
      console.error(`Error: ${error.name}`);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
      } else {
        throw error;
      }
    }
  })
);

/**
 * GET
 *  - returns a list of all courses including the User that owns each course
 *  - returns 200 HTTP status code
 */

router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    // find all courses
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.status(200).json(courses);
  })
);

module.exports = router;
