const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product.controller");
const {
  AuthorizationAdmin,
  AuthorizationUser,
} = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

const { ProductExist } = require("../middleware/exist-middleware");

router.get("/", AuthorizationUser, ProductController.asyncGetAll);

router.post(
  "/",
  validationMiddleware.product,
  AuthorizationAdmin,
  ProductController.asyncCreate
);

router.get("/:id_product", AuthorizationUser, ProductController.asyncGetByID);

router.put(
  "/:id_product",
  validationMiddleware.product,
  AuthorizationAdmin,
  ProductExist,
  ProductController.asyncUpdate
);

router.delete(
  "/:id_product",
  AuthorizationAdmin,
  ProductExist,
  ProductController.asyncDelete
);

module.exports = router;
