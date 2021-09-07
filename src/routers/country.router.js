const express = require("express");
const router = express.Router();

const CountryController = require("../controllers/country.controller");
const { AuthorizationAdmin } = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", AuthorizationAdmin, CountryController.getCountries);

router
  .get(
    "/countryid/:id",
    // validationMiddleware.id,
    AuthorizationAdmin,
    CountryController.getCountryByID
  )

  .post(
    "/:id/city",
    // validationMiddleware.id,
    validationMiddleware.locationName,
    AuthorizationAdmin,
    CountryController.postCity
  )

  .put(
    "/:id",
    // validationMiddleware.id,
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
