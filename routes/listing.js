const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

// ✅ Multer setup with Cloudinary
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ✅ JOI validation middleware (inject image path into body before validation)
const validateListing = (req, res, next) => {
  if (req.file) {
    req.body.listing.image = req.file.path; // Add uploaded image URL to body
  }

  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

// ✅ INDEX and CREATE routes
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"), 
    validateListing,                 
    wrapAsync(listingController.createListing)
  );

// ✅ NEW LISTING FORM
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ✅ SHOW, UPDATE, DELETE routes
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    upload.single("listing[image]"), 
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));

// ✅ EDIT FORM
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;


