const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const {
  AuthorizationAdmin,
} = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router
  .get("/", AuthorizationAdmin,
    UserController.getUsers)
  
router
  .get(
    "/getUserByName/:username",
    validationMiddleware.username,
    AuthorizationAdmin,
    UserController.getUserByUserName
  )
router
  .get(
    "/getUserByEmail/:email",
    validationMiddleware.email,
    AuthorizationAdmin,
    UserController.getUserByEmail
)

router.
  get("/getUserByID/:id",
    validationMiddleware.id,
    AuthorizationAdmin,
    UserController.getUserByID
      
)


    // .get(
    //   "/:username/exist",
    //   validationMiddleware.username,
    //   AuthorizationAdmin,
    //   UserController.userExists
    // )

    .post("/login", validationMiddleware.login, UserController.login)

    .post(
      "/registration",
      validationMiddleware.userData,
      AuthorizationAdmin,
      UserController.Create
    )

    .put(
      "/:id",
      validationMiddleware.id,
      validationMiddleware.userUpdateData,
      AuthorizationAdmin,
      UserController.Update
    )

    .delete(
      "/:id",
      validationMiddleware.id,
      AuthorizationAdmin,
      UserController.Delete
    );

module.exports = router;
