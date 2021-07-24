const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/order.controller");
const {
  AuthorizationAdmin,
  AuthorizationUser,
  CurrentUser,
  ConfidentialInfo,
} = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router
  .get("/", AuthorizationAdmin, OrderController.asyncGetAll)

  .post(
    "/",
    validationMiddleware.order,
    AuthorizationUser,
    CurrentUser,
    OrderController.asyncCreate
  )
  .get(
    "/:id_user",
    AuthorizationUser,
    ConfidentialInfo,
    OrderController.asyncGetAllByUser
  )
  .put(
    "/:id_order",
    validationMiddleware.status,
    AuthorizationAdmin,
    OrderController.asyncUpdate
  )
  .delete("/:id_order", AuthorizationAdmin, OrderController.asyncDelete);

module.exports = router;
