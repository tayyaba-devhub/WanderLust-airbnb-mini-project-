const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

// Index and Create Route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  );


// New Listing Form Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update, Delete Route
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));

// Edit Listing Form Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;