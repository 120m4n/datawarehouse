const express = require("express");
const router = express.Router();

const CountryController = require("../controllers/country.controller");
const { AuthorizationAdmin } = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", AuthorizationAdmin, CountryController.getCountries);

router
  .get(
    "/:id",
    validationMiddleware.id,
    AuthorizationAdmin,
    CountryController.getCountryByID
  )

  // .post(
  //   "/",
  //   validationMiddleware.locationName,
  //   AuthorizationAdmin,
  //   CountryController.postRegions
  // )

  .put(
    "/:id",
    validationMiddleware.id,
    validationMiddleware.locationName,
    AuthorizationAdmin,
    CountryController.putCountriesById
  )

  .delete(
    "/:id",
    validationMiddleware.id,
    AuthorizationAdmin,
    CountryController.deleteCountriesById
  );

module.exports = router;
