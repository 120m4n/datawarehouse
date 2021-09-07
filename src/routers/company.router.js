const express = require("express");
const router = express.Router();

const CompanyController = require("../controllers/company.controller");
const {
  AuthorizationAdmin,
  AuthorizationUser,
} = require("../auth/authorization");

// const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", CompanyController.getCompanies);


router
  .get(
    "/companyId/:id",
    AuthorizationAdmin,
    CompanyController.getCompanyByID
  )


  // .post(
  //   "/",
  //   // validationMiddleware.userData,
  //   AuthorizationAdmin,
  //   CompanyController.Create
  // )

  // .put(
  //   "/:id",
  //   AuthorizationAdmin,
  //   CompanyController.Update
  // )

  // .delete(
  //   "/:id",
  //   AuthorizationAdmin,
  //   CompanyController.Delete
  // );

module.exports = router;
