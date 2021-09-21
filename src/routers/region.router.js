const express = require("express");
const router = express.Router();

const RegionController = require("../controllers/region.controller");
const { AuthorizationAdmin, AuthorizationUser } = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", AuthorizationUser, RegionController.getRegions);

router
  .get(
    "/regionid/:id",
    // validationMiddleware.id,
    AuthorizationUser,
    RegionController.getRegionByID
  )
  .get(
    "/treeview",
    AuthorizationUser,
    RegionController.getTreeview
  )

  .post(
    "/",
    validationMiddleware.dataName,
    AuthorizationUser,
    RegionController.postRegions
  )
  .post(
    "/:id/country",
    // validationMiddleware.id,
    validationMiddleware.dataName,
    AuthorizationUser,
    RegionController.postCountry
  )

  .put(
    "/:id",
    validationMiddleware.id,
    validationMiddleware.dataName,
    AuthorizationUser,
    RegionController.putRegionsById
  )

  .delete(
    "/:id",
    validationMiddleware.id,
    AuthorizationUser,
    RegionController.deleteRegionsById
  );

module.exports = router;
