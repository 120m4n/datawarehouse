const express = require("express");
const router = express.Router();

const CityController = require("../controllers/city.controller");
const { AuthorizationAdmin } = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", AuthorizationAdmin, CityController.getCities);

router.get(
  "/:id",
  validationMiddleware.id,
  AuthorizationAdmin,
  CityController.getCityByID
);

router.put(
  "/:id",
  validationMiddleware.id,
  validationMiddleware.locationName,
  AuthorizationAdmin,
  CityController.putCitiesById
);

router.delete(
  "/:id",
  validationMiddleware.id,
  AuthorizationAdmin,
  CityController.deleteCitiesById
);

module.exports = router;
