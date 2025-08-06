// const express = require("express");
// const router = express.Router({mergeParams:true});
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
// const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
// const reviewController = require("../controllers/review.js");



// //post Review Route
// router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview)
// );


// //Post Delete Route
// router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

// module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// POST - create review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// GET - render edit form
router.get("/:reviewId/edit", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.renderEditForm));

// PUT - update review
router.put("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.updateReview));

// DELETE - delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
