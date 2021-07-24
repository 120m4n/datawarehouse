const express = require("express");
const router = express.Router();

const LocationController = require("../controllers/location.controller");
const { AuthorizationAdmin } = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

// const { ProductExist } = require("../middleware/exist-middleware");

router.get("/", AuthorizationAdmin, LocationController.Read);

router.get(
  "/:id/countries",
  AuthorizationAdmin,
  LocationController.ReadCountries
);

router.get(
  "/:id/cities",
  AuthorizationAdmin,
  LocationController.ReadCities
);

router.post(
  "/",
  AuthorizationAdmin,
  validationMiddleware.locationName,
  LocationController.Create
);

// router.get("/:id_product",
//   AuthorizationAdmin,
//   LocationController.GetByID);

// router.put(
//   "/:id_product",
//   validationMiddleware.product,
//   AuthorizationAdmin,
//   ProductExist,
//   LocationController.Update
// );

// router.delete(
//   "/:id_product",
//   AuthorizationAdmin,
//   ProductExist,
//   LocationController.Delete
// );

module.exports = router;
