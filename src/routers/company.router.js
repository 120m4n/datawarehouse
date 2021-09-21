const express = require("express");
const router = express.Router();

const CompanyController = require("../controllers/company.controller");
const {
  AuthorizationAdmin,
  AuthorizationUser,
} = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", CompanyController.getCompanies);


router
  .get(
    "/companyId/:id",
    AuthorizationUser,
    CompanyController.getCompanyByID
  )


  .post(
    "/",
    validationMiddleware.companyData,
    AuthorizationUser,
    CompanyController.Create
  )

  .put(
    "/:id",
    validationMiddleware.id,
    validationMiddleware.companyData,
    AuthorizationUser,
    CompanyController.Update
  )

  .delete(
    "/:id",
    validationMiddleware.id,
    AuthorizationUser,
    CompanyController.Delete
  );

module.exports = router;
