// const Listing = require("../models/listing.js");

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index", { allListings });
// };

// module.exports.renderNewForm = (req, res) => {
//   res.render("listings/new.ejs");
// };
// module.exports.createListing = async (req, res, next) => {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     console.log(url, "--", filename);

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = {url,filename};
    
//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// }
// module.exports.showListing = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const listing = await Listing.findById(id)
//             .populate({
//                 path: "reviews",
//                 populate: { path: "author" }
//             })
//             .populate("owner");

//         if (!listing) {
//             req.flash("error", "Listing not found!");
//             return res.redirect("/listings");
//         }

//         res.render("listings/show.ejs", { listing });
//     } catch (err) {
//         req.flash("error", "Error loading listing");
//         res.redirect("/listings");
//     }
// };

// module.exports.renderEditForm = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const listing = await Listing.findById(id);

//         if (!listing) {
//             req.flash("error", "Listing not found!");
//             return res.redirect("/listings");
//         }

//         res.render("listings/edit.ejs", { listing });
//     } catch (err) {
//         req.flash("error", "Error loading edit form");
//         res.redirect("/listings");
//     }
// };

// module.exports.updateListing = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const listing = await Listing.findById(id).populate("owner");

//         if (!listing) {
//             req.flash("error", "Listing not found!");
//             return res.redirect("/listings");
//         }

//         if (!listing.owner._id.equals(req.user._id)) {
//             req.flash("error", "You don't have permission!");
//             return res.redirect(`/listings/${id}`);
//         }

//         await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//         req.flash("success", "Listing updated successfully!");
//         res.redirect(`/listings/${id}`);
//     } catch (err) {
//         req.flash("error", "Failed to update listing");
//         res.redirect(`/listings/${req.params.id}/edit`);
//     }
// };

// module.exports.destroyListing = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const listing = await Listing.findById(id);

//         if (!listing) {
//             req.flash("error", "Listing not found!");
//             return res.redirect("/listings");
//         }

//         if (!listing.owner.equals(req.user._id)) {
//             req.flash("error", "You don't have permission!");
//             return res.redirect(`/listings/${id}`);
//         }

//         await Listing.findByIdAndDelete(id);
//         req.flash("success", "Listing deleted successfully!");
//         res.redirect("/listings");
//     } catch (err) {
//         req.flash("error", "Failed to delete listing");
//         res.redirect("/listings");
//     }
// };

const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  
  // image now comes directly from form as a string URL
  newListing.image = req.body.listing.image;

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" }
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (err) {
    req.flash("error", "Error loading listing");
    res.redirect("/listings");
  }
};

module.exports.renderEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    req.flash("error", "Error loading edit form");
    res.redirect("/listings");
  }
};

module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    if (!listing.owner._id.equals(req.user._id)) {
      req.flash("error", "You don't have permission!");
      return res.redirect(`/listings/${id}`);
    }

    // Spread updated fields
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    req.flash("error", "Failed to update listing");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

module.exports.destroyListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You don't have permission!");
      return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", "Failed to delete listing");
    res.redirect("/listings");
  }
};
