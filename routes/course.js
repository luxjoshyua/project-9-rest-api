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
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: {
          model: User,
          attributes: ["firstName", "lastName", "emailAddress"],
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
      res
        .location("/courses" + course.id)
        .status(201)
        // TODO: remember to delete this message before submitting for marking
        .json({ message: "Course successfully created!" })
        .end();
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
  asyncHandler(async (req, res, next) => {
    // user is undefined, meaning user id is undefined
    // currentUser comes from the middleware; we're not using it yet, so
    // of course it's undefined
    const user = req.currentUser;
    console.log(`What is my user: ${user}`);
    const course = await Course.findByPk(req.params.id, {
      include: User,
    });

    if (course) {
      // check current user is connected to the course
      // console.log(`What is this course id here: ${course.userId}`);

      if (user.emailAddress === course.User.emailAddress) {
        try {
          // const [updated] = await Course.update(req.body, {
          //   where: {
          //     id: req.params.id,
          //   },
          // });
          // if (updated) {
          //   res.status(204).end();
          // } else {
          //   res.sendStatus(400);
          // }
        } catch (error) {
          // if (error.name === "SequelizeValidationError") {
          //   const errors = error.errors.map((err) => err.message);
          //   res.status(400).json({ errors });
          // } else {
          //   next(error);
          // }
        }
      } else {
        // access not allowed to the db
        res.status(404);
      }
    } else {
      // not found
      res.status(404);
    }
  })
);

/**
 * DELETE
 *  - deletes corresponding course
 *  - returns 204 HTTP status code and no content
 */
// router.delete(
//   "/courses/:id",
//   asyncHandler(async (req, res) => {
//     // find the course to delete
//     const course = await Course.findByPk(req.params.id);
//     console.log(`What is my course here: ${course}`);
//     if (course) {
//       // check if the user email address === the course User email address
//       if (user.emailAddress !== course.User.emailAddress) {
//         res.status(403).json({ message: "Access denied" }).end();
//       } else {
//         await course.destroy();
//         res
//           .status(204)
//           .message({ message: "You successfully deleted the course" })
//           .end();
//       }
//     } else {
//       res.status(404).json({
//         message: "You tried to delete a course that does not exist.",
//       });
//     }
//   })
// );

router.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    res.status(204).end();

    // const course = await Course.findByPk(req.params.id);
    // check the course actually exists, otherwise it will just hang
    // console.log(`What is my course here: ${course}`);
    // if (course) {
    //   await course.destroy();
    //   res.status(204).end();
    // } else {
    //   res.status(404);
    // }
  })
);

module.exports = router;
