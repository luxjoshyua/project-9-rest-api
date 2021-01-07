"use strict";

const express = require("express");
const { Course, User } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");

// Construct router instance
const router = express.Router();

/**
 * GET
 *  - returns a list of all courses including the User that owns each course
 *  - returns 200 HTTP status code
 */

router.get(
  "/courses",
  authenticateUser,
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
