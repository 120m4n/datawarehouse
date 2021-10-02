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
  .post(
    "/",
    validationMiddleware.contactData,
    AuthorizationUser,
    ContactController.Create
  )

  .post(
    "/:id/channels",
    validationMiddleware.contactChannelData,
    AuthorizationUser,
    ContactController.CreateChannels
  )

  .delete(
    "/:id",
    validationMiddleware.id,
    AuthorizationUser,
    ContactController.Delete
  );

module.exports = router;
