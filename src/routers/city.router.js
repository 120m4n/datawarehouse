const express = require("express");
const router = express.Router();

const CityController = require("../controllers/city.controller");
const { AuthorizationAdmin, AuthorizationUser } = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", AuthorizationUser, CityController.getCities);

router
  .get(
    "/cityid/:id",
    // validationMiddleware.id,
    AuthorizationUser,
    CityController.getCityByID
  );

router.put(
  "/:id",
  // validationMiddleware.id,
  validationMiddleware.dataName,
  AuthorizationUser,
  CityController.putCitiesById
);

router.delete(
  "/:id",
  validationMiddleware.id,
  AuthorizationUser,
  CityController.deleteCitiesById
);

module.exports = router;
