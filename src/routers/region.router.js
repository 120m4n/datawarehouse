const express = require("express");
const router = express.Router();

const RegionController = require("../controllers/region.controller");
const { AuthorizationAdmin } = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", AuthorizationAdmin, RegionController.getRegions);

router
  .get(
    "/regionid/:id",
    // validationMiddleware.id,
    AuthorizationAdmin,
    RegionController.getRegionByID
  )
  .get(
    "/treeview",
    AuthorizationAdmin,
    RegionController.getTreeview
  )

  .post(
    "/",
    validationMiddleware.locationName,
    AuthorizationAdmin,
    RegionController.postRegions
  )
  .post(
    "/:id/country",
    // validationMiddleware.id,
    validationMiddleware.locationName,
    AuthorizationAdmin,
    RegionController.postCountry
  )

  .put(
    "/:id",
    validationMiddleware.id,
    validationMiddleware.locationName,
    AuthorizationAdmin,
    RegionController.putRegionsById
  )

  .delete(
    "/:id",
    validationMiddleware.id,
    AuthorizationAdmin,
    RegionController.deleteRegionsById
  );

module.exports = router;
