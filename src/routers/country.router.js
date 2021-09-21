const express = require("express");
const router = express.Router();

const CountryController = require("../controllers/country.controller");
const { AuthorizationAdmin, AuthorizationUser } = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", AuthorizationUser, CountryController.getCountries);

router
  .get(
    "/countryid/:id",
    // validationMiddleware.id,
    AuthorizationUser,
    CountryController.getCountryByID
  )

  .post(
    "/:id/city",
    // validationMiddleware.id,
    validationMiddleware.dataName,
    AuthorizationUser,
    CountryController.postCity
  )

  .put(
    "/:id",
    // validationMiddleware.id,
    validationMiddleware.dataName,
    AuthorizationUser,
    CountryController.putCountriesById
  )

  .delete(
    "/:id",
    validationMiddleware.id,
    AuthorizationUser,
    CountryController.deleteCountriesById
  );

module.exports = router;
