const express = require("express");
const router = express.Router();

const RegionController = require("../controllers/region.controller");
const { AuthorizationAdmin } = require("../auth/authorization");

const validationMiddleware = require("../middleware/validation-middleware");

router.get("/", AuthorizationAdmin, RegionController.getRegions);

router
  .get(
    "/:id",
    validationMiddleware.id,
    AuthorizationAdmin,
    RegionController.getRegionByID
  )

  .post(
    "/",
    validationMiddleware.locationName,
    AuthorizationAdmin,
    RegionController.postRegions
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
