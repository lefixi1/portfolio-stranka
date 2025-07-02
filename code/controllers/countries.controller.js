const multer = require("multer");
const { fileFilter, storage } = require("../util/fileUpload");
const Country = require("../models/country.model");
const Review = require("../models/review.model");
const Trip = require("../models/trip.model");

let upload = multer({ storage, fileFilter, limits: { fileSize: "10MB" } });

const getCountries = async (req, res) => {
  try {
    const countries = await Country.fetchAll();
    res.render("country/Countries", { countries });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const getSingleCountry = async (req, res) => {
  const { countryName } = req.params;

  let order = req.query.order;

  if (!order) {
    order = "name";
  }

  let nextOrder = "desc";
  if (order === "desc") {
    nextOrder = "asc";
  }

  let trips = [];
  try {
    const tripInstance = new Trip({ count_name: countryName });
    trips = await tripInstance.fetchByCountryName();

    if (!trips) {
      trips = [];
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }

  if (order === "asc" || order === "desc") {
    trips.sort((a, b) => {
      if (
        (order === "asc" && a.price > b.price) ||
        (order === "desc" && a.price < b.price)
      ) {
        return 1;
      } else if (
        (order === "asc" && a.price < b.price) ||
        (order === "desc" && a.price > b.price)
      ) {
        return -1;
      }
      return 0;
    });
  } else if (order === "name") {
    trips.sort((a, b) => {
      if (a.trip_tit.toLowerCase() > b.trip_tit.toLowerCase()) {
        return 1;
      } else if (a.trip_tit.toLowerCase() < b.trip_tit.toLowerCase()) {
        return -1;
      }
      return 0;
    });
  }

  try {
    const countries = await Country.fetchAll();
    const country = countries.find(
      (c) => c.count_name.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) {
      return res.status(404).render("shared/404");
    }

    res.render("country/Country", {
      numberOfTrips: trips.length,
      trips: trips.map((item) => {
        return {
          ...item,
          humanReadableDateDep: new Date(item.date_dep).toLocaleDateString(
            "sk"
          ),
          humanReadableDateRet: new Date(item.date_ret).toLocaleDateString(
            "sk"
          ),
        };
      }),
      countries: countries,
      country: country,
      order: order,
      nextOrder: nextOrder,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const getTripsDetails = async (req, res) => {
  const { countryName, id } = req.params;
  try {
    const countries = await Country.fetchAll();
    const tripInstance = new Trip({ count_name: countryName });
    const trips = await tripInstance.fetchByCountryName();
    const trip = trips.find((t) => t.trip_id === parseInt(id));

    if (!trip) {
      console.log("Trip not found");
      return res.status(404).render("shared/404");
    }

    res.render("trip/Trip-details", {
      countryName,
      trip: {
        ...trip,
        humanReadableDateDep: new Date(trip.date_dep).toLocaleDateString("sk"),
        humanReadableDateRet: new Date(trip.date_ret).toLocaleDateString("sk"),
      },
      countries,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("shared/500");
  }
};

const getTripReviews = async (req, res) => {
  const { countryName, tripId } = req.params;
  try {
    const reviewInstance = new Review();
    const reviews = await reviewInstance.fetchByTrip(tripId);

    const formattedReviews = reviews.map((review) => ({
      ...review,
      date: review.date.toLocaleDateString("sk"),
    }));
    res.json(formattedReviews);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error.message });
  }
};

const addTripReview = [
  upload.single("image"),
  async (req, res) => {
    const { countryName, tripId } = req.params;
    const { descr, rating } = req.body;
    let imageLocation = "";

    try {
      if (req.file && req.file.filename) {
        imageLocation = req.file.filename;
      }

      const review = new Review({
        user_id: res.locals.user.id,
        text: descr,
        rating: parseInt(rating),
        trip_id: parseInt(tripId),
        imageLocation: imageLocation,
      });

      await review.save();

      res.json({});
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },
];

const updateReview = [
  upload.single("image"),
  async (req, res) => {
    const { countryName, tripId, reviewId } = req.params;
    const { text, rating, deleteImage } = req.body;

    try {
      const reviewInstance = new Review({}, reviewId);
      const existingReview = await reviewInstance.fetch();

      if (!existingReview) {
        console.log("Review not found for update:", reviewId);
        return res.status(404).json({ error: "Review not found." });
      }

      existingReview.text = text;
      existingReview.rating = parseInt(rating);

      if (deleteImage === "true") {
        existingReview.imageLocation = null;
      } else if (req.file && req.file.filename) {
        existingReview.imageLocation = req.file.filename;
      }

      await existingReview.save();

      res.json({ success: true });
    } catch (error) {
      console.log("Error in updateReview:", error);
      res.status(500).json({ error: error.message });
    }
  },
];

const deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;

  try {
    const review = new Review({}, reviewId);
    await review.delete();

    res.json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review.",
      error: error.message,
    });
  }
};

const getAddCountry = async (req, res) => {
  try {
    const countries = await Country.fetchAll();
    let inputData = req.session.inputData;

    if (!inputData) {
      inputData = {
        name: "",
        short_description: "",
        description: "",
      };
    }

    req.session.inputData = null;

    res.render("admin/Add-country", { countries, inputData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("shared/500");
  }
};

const addCountry = [
  upload.single("image"),
  async (req, res) => {
    const { name, short_description, description } = req.body;
    let imageLocation = "";

    const inputData = {
      ...req.body,
    };

    if (req.file.path) {
      imageLocation = req.file.filename;
    }

    try {
      const countries = await Country.fetchAll();
      const country = countries.find((c) => c.count_name === name);

      if (country) {
        req.session.inputData = {
          ...inputData,
          errorMessage: "Country already exists",
        };
        return res.redirect("/admin/Add-country");
      }

      const newCountry = new Country({
        count_name: name,
        count_descr: short_description,
        count_descr_long: description,
        imageLocation,
      });
      await newCountry.save();
      return res.redirect("/Countries");
    } catch (error) {
      console.log(error.message);
      res.status(500).render("shared/500");
    }
  },
];

const getEditTrip = async (req, res) => {
  const { countryName, id } = req.params;

  try {
    const countries = await Country.fetchAll();
    const trip = new Trip({}, id);
    const tripDetails = await trip.fetchDetailsById();
    if (!tripDetails) {
      return res.status(404).render("shared/404");
    }

    let inputData = req.session.inputData;

    if (!inputData) {
      inputData = {
        description: tripDetails.trip_descr,
        amountP: tripDetails.amount,
        dateD: new Date(tripDetails.date_dep).toISOString().slice(0, 10),
        dateR: new Date(tripDetails.date_ret).toISOString().slice(0, 10),
        typeR: tripDetails.room_type,
        typeT: tripDetails.trip_type,
        price: tripDetails.price,
        oldPrice: tripDetails.old_price,
        image: tripDetails.imageLocation,
      };
    }

    const referer = req.get("Referer");
    if (referer) {
      req.session.returnTo = referer;
    }

    req.session.inputData = null;

    res.render("admin/Trip-edit", { trip: tripDetails, countries, inputData });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const updateTrip = [
  upload.single("image"),
  async (req, res) => {
    const {
      description,
      amountP,
      dateD,
      dateR,
      typeR,
      typeT,
      price,
      oldPrice,
      image,
    } = req.body;

    const inputData = {
      ...req.body,
    };

    let imageLocation = image;

    if (req.file && req.file.path) {
      imageLocation = req.file.filename;
    }
    try {
      const trip = new Trip({}, req.params.id);
      const existingTrip = await trip.fetchDetailsById();
      const updatedTrip = new Trip(
        {
          trip_descr: description || existingTrip.trip_descr,
          amount: amountP || existingTrip.amount,
          date_dep: dateD || existingTrip.date_dep,
          date_ret: dateR || existingTrip.date_ret,
          room_type: typeR || existingTrip.room_type,
          trip_type: typeT || existingTrip.trip_type,
          price: price || existingTrip.price,
          old_price: oldPrice || existingTrip.old_price,
          imageLocation: imageLocation || existingTrip.imageLocation,

          trip_tit: existingTrip.trip_tit,
          count_id: existingTrip.count_id,
        },
        req.params.id
      );
      await updatedTrip.save();

      const updatedTripDetails = await updatedTrip.fetchDetailsById();
      if (!updatedTripDetails) {
        return res.status(404).render("shared/404");
      }

      const returnTo =
        req.session.returnTo ||
        `/Countries/${updatedTripDetails.count_name}/${updatedTripDetails.trip_id}`;

      res.redirect(returnTo);
    } catch (error) {
      console.log(error.message);
      res.status(500).render("shared/500");
    }
  },
];

const deleteTrip = async (req, res) => {
  const tripId = req.params.id;
  const countryName = req.params.countryName;

  try {
    const trip = new Trip(null, parseInt(tripId));
    await trip.delete();
    res.status(200).json({ message: "Trip successfully deleted." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting trip." });
  }
};

const getEditCountry = async (req, res) => {
  const { countryId } = req.params;
  const countId = parseInt(req.params.countryId, 10);

  try {
    const countries = await Country.fetchAll();
    const country = countries.find((c) => c.count_id === countId);
    if (!country) {
      return res.status(404).render("shared/404");
    }

    let inputData = req.session.inputData;

    if (!inputData) {
      inputData = {
        short_description: country.count_descr,
        description: country.count_descr_long,
        image: country.imageLocation,
      };
    }

    req.session.inputData = null;

    res.render("admin/Country-edit", { country, countries, inputData });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const updateCountry = [
  upload.single("image"),
  async (req, res) => {
    const { short_description, description, image } = req.body;
    const countryId = parseInt(req.params.countryId, 10);

    const inputData = {
      ...req.body,
    };

    let imageLocation = image;

    if (req.file && req.file.path) {
      imageLocation = req.file.filename;
    }
    try {
      const countries = await Country.fetchAll();
      const existingCountry = countries.find((c) => c.count_id === countryId);

      if (!existingCountry) {
        return res.status(404).render("shared/404");
      }

      const updatedCountry = new Country({}, existingCountry.count_id);

      updatedCountry.count_descr =
        short_description || existingCountry.count_descr;
      updatedCountry.count_descr_long =
        description || existingCountry.count_descr_long;
      updatedCountry.imageLocation =
        imageLocation || existingCountry.imageLocation;

      await updatedCountry.save();

      res.redirect("/Countries");
    } catch (error) {
      console.log(error.message);
      res.status(500).render("shared/500");
    }
  },
];

const deleteCountry = async (req, res) => {
  const countryId = req.params.countryId;

  try {
    const tripInstance = new Trip({ count_id: countryId });
    await tripInstance.deleteByCountryId(countryId);

    const country = new Country({}, countryId);
    await country.delete();
    res.json({ success: true, message: "Country deleted successfully." });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete country.",
      error: error.message,
    });
  }
};

module.exports = {
  getCountries,
  getSingleCountry,
  getTripsDetails,
  getTripReviews,
  addTripReview,
  updateReview,
  deleteReview,
  getAddCountry,
  addCountry,
  getEditTrip,
  updateTrip,
  deleteTrip,
  getEditCountry,
  updateCountry,
  deleteCountry,
};
