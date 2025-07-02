const express = require("express");
const router = express.Router();

const protectRoutes = require("../middlewares/route-protect.middleware");

const {
  getCountries,
  getSingleCountry,
  getTripsDetails,
  getTripReviews,
  addTripReview,
  getAddCountry,
  addCountry,

  updateReview,
  deleteReview,
} = require("../controllers/countries.controller");

router.get("/Countries", getCountries);

router.get("/Countries/:countryName", protectRoutes, getSingleCountry);

router.get("/Countries/:countryName/:id", getTripsDetails);

router.get("/Countries/:countryName/:tripId/reviews", getTripReviews);

router.post("/Countries/:countryName/:tripId/reviews", addTripReview);

router.put(
  "/Countries/:countryName/:tripId/reviews/:reviewId/edit",
  updateReview
);

router.delete(
  "/Countries/:countryName/:tripId/reviews/:reviewId/delete",
  deleteReview
);

module.exports = router;
