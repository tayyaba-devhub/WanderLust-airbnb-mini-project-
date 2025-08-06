
const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        listing.reviews.push(review);
        await review.save();
        await listing.save();
        req.flash("success", "Review created successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};

module.exports.renderEditForm = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const listing = await Listing.findById(id);
        const review = await Review.findById(reviewId);
        
        if (!listing || !review) {
            req.flash("error", "Listing or review not found");
            return res.redirect(`/listings/${id}`);
        }
        
        res.render("reviews/edit", { listing, review });
    } catch (err) {
        next(err);
    }
};

module.exports.updateReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
        req.flash("success", "Review updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};

module.exports.destroyReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};