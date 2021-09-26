const express = require("express");
const router = express.Router();

const ContactController = require("../controllers/contact.controller.js");
const {
  AuthorizationAdmin,
  AuthorizationUser,
} = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", AuthorizationUser, ContactController.getContacts);
router.get("/:id",AuthorizationUser, ContactController.getContactById);

router
//   .get(
//     "/getUserByName/:username",
//     validationMiddleware.username,
//     AuthorizationAdmin,
//     ContactController.getUserByUserName
//   )
// router
//   .get(
//     "/getUserByEmail/:email",
//     validationMiddleware.email,
//     AuthorizationAdmin,
//     ContactController.getUserByEmail
// )

// router.
//   get("/getUserByID/:id",
//     validationMiddleware.id,
//     AuthorizationAdmin,
//     ContactController.getUserByID

// )

//     // .get(
//     //   "/:username/exist",
//     //   validationMiddleware.username,
//     //   AuthorizationAdmin,
//     //   ContactController.userExists
//     // )

//     .post("/login", validationMiddleware.login, ContactController.login)

//     .post(
//       "/registration",
//       validationMiddleware.userData,
//       AuthorizationAdmin,
//       ContactController.Create
//     )

//     .put(
//       "/:id",
//       validationMiddleware.id,
//       validationMiddleware.userUpdateData,
//       AuthorizationAdmin,
//       ContactController.Update
//     )

    .delete(
      "/:id",
      validationMiddleware.id,
      AuthorizationUser,
      ContactController.Delete
    );

module.exports = router;
