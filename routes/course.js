"use strict";

const express = require("express");
const { Course, User } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");

// construct router instance
const router = express.Router();

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
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"],
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
        attributes: [
          "id",
          "title",
          "description",
          "estimatedTime",
          "materialsNeeded",
        ],
        include: {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
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
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      // post new course
      const course = await Course.create(req.body);
      res.location(`/courses/${course.id}`).status(201).end();
    } catch (error) {
      console.error(`Error: ${error.name}`);
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

/**
 * PUT
 *  - updates the corresponding course
 *  - returns 204 HTTP status code and no content
 */
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;

    try {
      const course = await Course.findByPk(req.params.id, {
        include: {
          model: User,
        },
      });
      // check if the user email address === the course User email address
      if (user.emailAddress === course.User.emailAddress) {
        if (course) {
          await course.update(req.body);
          res.sendStatus(204);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(403).json({ message: "Access denied" });
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

/**
 * DELETE
 *  - deletes corresponding course
 *  - returns 204 HTTP status code and no content
 */
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id, {
      include: User,
    });

    if (user.emailAddress === course.User.emailAddress) {
      if (course) {
        await course.destroy();
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(403);
    }
  })
);

module.exports = router;
