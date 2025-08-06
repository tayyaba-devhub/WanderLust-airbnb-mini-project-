
const Listing = require("../models/listing.js");
const axios = require("axios");
const ExpressError = require("../utils/ExpressError.js");

const locationiqToken = process.env.LOCATIONIQ_TOKEN;

// INDEX - Show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// NEW - Show form to create a new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// CREATE - Add new listing with geolocation from LocationIQ
module.exports.createListing = async (req, res, next) => {
  try {
    const { location } = req.body.listing;

    // 🌍 Get coordinates from LocationIQ
    const response = await axios.get("https://us1.locationiq.com/v1/search", {
      params: {
        key: locationiqToken,
        q: location,
        format: "json",
      },
    });

    const geo = response.data[0];

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // 📷 Image upload
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // 📍 Store geo-coordinates [lon, lat]
    newListing.geometry = {
      type: "Point",
      coordinates: [parseFloat(geo.lon), parseFloat(geo.lat)],
    };

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error("Geolocation Error:", err.message);
    return next(new ExpressError("Location not found. Please enter a valid location.", 400));
  }
};
module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {
      listing,
      currUser: req.user, // 👈 this was added
      LOCATIONIQ_TOKEN: process.env.LOCATIONIQ_TOKEN,
    });
  } catch (err) {
    next(err);
  }
};


// EDIT - Show form to edit a listing
module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const originalImageUrl = listing.image?.url?.replace("/upload", "/upload/w_250") || "";
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  } catch (err) {
    next(err);
  }
};

// UPDATE - Update listing info
module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

// DELETE - Remove listing
module.exports.destroyListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};
