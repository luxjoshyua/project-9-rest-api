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
          as: "user",
          attributes: ["firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.status(200).json(courses);
  })
);

/**
 * GET
 *  - returns corresponding course
 *  - returns User that owns that course
 *  - returns 200 HTTP status code
 */
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    try {
      // get the corresponding course
      const course = await Course.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["firstName", "lastName", "emailAddress"],
          },
        ],
      });
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

/**
 * POST
 *  - creates new course
 *  - sets Location header to the URI for the newly created course
 *  - returns 201 HTTP status code and no content
 */

router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    try {
      // post new course
      const course = await Course.create(req.body);
      res
        .location("/")
        .status(201)
        // TODO: remember to delete this message before submitting for marking
        .json({ message: "Course successfully created!" })
        .end();
    } catch (error) {
      console.error(`Error: ${error.name}`);
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
