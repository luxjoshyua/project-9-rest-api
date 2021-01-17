"use strict";

const express = require("express");

const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { User } = require("../models");

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
    // filter the response

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
      // create new User
      await User.create(req.body);
      res.status(201).location("/").end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
