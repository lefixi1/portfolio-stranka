const Book = require("../models/book.model");
const Country = require("../models/country.model");
const Trip = require("../models/trip.model");

const getBook = async (req, res) => {
  const { country, trip } = req.query;
  let trips = [];
  let selectedCountry = country || "";
  let selectedTrip = trip || "";
  try {
    const countries = await Country.fetchAll();
    const allTrips = await Trip.fetchAll();
    if (country) {
      let countryObj = countries.find(
        (c) => String(c.count_id) === String(country)
      );

      if (!countryObj) {
        countryObj = countries.find(
          (c) => c.count_name.toLowerCase() === country.toLowerCase()
        );
      }

      if (countryObj) {
        selectedCountry = String(countryObj.count_id);
        const allTrips = await Trip.fetchAll();
        trips = allTrips.filter(
          (t) => t.count_id === parseInt(selectedCountry)
        );
      }
    } else if (trip) {
      const allTrips = await Trip.fetchAll();
      const foundTrip = allTrips.find(
        (t) => String(t.trip_id) === String(trip)
      );
      if (foundTrip) {
        trips = allTrips.filter((t) => t.count_id === foundTrip.count_id);
        selectedCountry = String(foundTrip.count_id);
        selectedTrip = String(foundTrip.trip_id);
      }
    }

    let inputData = req.session.inputData;

    if (!inputData) {
      inputData = {
        namein: req.session.user.name || "",
        surnamein: req.session.user.surname || "",
        telin: "",
        mailin: req.session.user.email || "",
        countin: "",
        cityin: "",
        trip: selectedTrip || "",
        amountP: "",
      };
    }

    req.session.inputData = null;

    res.render("book/Book", {
      countries,
      inputData,
      trips,
      selectedCountry,
      selectedTrip,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const createBook = async (req, res) => {
  const { namein, surnamein, telin, mailin, countin, cityin, trip, amountP } =
    req.body;

  const inputData = {
    ...req.body,
  };

  try {
    const tripInstance = new Trip({}, parseInt(trip));
    const chosenTrip = await tripInstance.fetchDetailsById();

    if (!chosenTrip || chosenTrip.length === 0) {
      inputData.errorMessage = "Trip not found";
      req.session.inputData = inputData;
      return res.redirect("/Book");
    }

    const seatsLeft = chosenTrip.amount - parseInt(amountP);

    if (seatsLeft < 0) {
      inputData.errorMessage = "Not enough seats available";
      req.session.inputData = inputData;
      return res.redirect("/Book");
    }

    await tripInstance.updateSeats(seatsLeft);

    const newBooking = new Book({
      user_id: req.session.user.id,
      name: namein,
      surname: surnamein,
      phone: telin,
      email: mailin,
      country: countin,
      city: cityin,
      ppl_amount: amountP,
      count_id: chosenTrip.count_id,
      trip_id: parseInt(trip),
    });

    await newBooking.save();

    res.redirect("/Book/Book_list");
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const getCountryTrips = async (req, res) => {
  const countryId = req.params.countryId;
  try {
    const allTrips = await Trip.fetchAll();
    const filteredTrips = allTrips.filter(
      (t) => t.count_id === parseInt(countryId)
    );

    res.json(filteredTrips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookList = async (req, res) => {
  let userBookings = [];
  let allUserBookings = [];

  try {
    const userId = req.session.user.id;

    const countries = await Country.fetchAll();
    const booking = new Book({ user_id: userId });
    userBookings = await booking.fetchByUser();

    allUserBookings = await Book.fetchAll();
    res.render("book/Book_list", {
      bookings: userBookings,
      allUserBookings,
      countries,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const getBookEdit = async (req, res) => {
  const { id } = req.params;
  const { country } = req.query;

  let trips = [];
  let bookingDetails = {};
  try {
    const countries = await Country.fetchAll();

    const booking = new Book({}, id);
    bookingDetails = await booking.fetchById();

    if (!bookingDetails) {
      console.log("Booking not found in database");
      return res.status(404).render("shared/404");
    }

    let selectedCountry;
    if (req.session.inputData && req.session.inputData.country) {
      selectedCountry = req.session.inputData.country;
    } else {
      selectedCountry = bookingDetails.count_id;
    }

    const allTrips = await Trip.fetchAll();
    trips = allTrips.filter((t) => t.count_id === parseInt(selectedCountry));

    let inputData = req.session.inputData;

    if (!inputData) {
      inputData = {
        ppl_amount: bookingDetails.ppl_amount,
        country: bookingDetails.count_id,
        trip: bookingDetails.trip_id,
      };
    }

    req.session.inputData = null;

    res.render("book/Book-edit", {
      countries,
      trips,
      booking: bookingDetails,
      selectedCountry,
      inputData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const updateBook = async (req, res) => {
  const { bookId, trip, amountP, country } = req.body;
  const id = bookId;

  const inputData = {
    ...req.body,
  };

  try {
    const booking = new Book({}, id);
    const bookingDetails = await booking.fetchById();

    if (!bookingDetails) {
      inputData.errorMessage = "Booking not found";
      req.session.inputData = inputData;
      return res.redirect(`/Book/Book_list/${id}/edit`);
    }

    const oldAmount = bookingDetails.ppl_amount;
    const newAmount = parseInt(amountP);
    const oldTripId = bookingDetails.trip_id;
    const newTripId = parseInt(trip);

    const originalTripInstance = new Trip({}, oldTripId);
    const originalTripDetails = await originalTripInstance.fetchDetailsById();

    const newTripInstance = new Trip({}, newTripId);
    const newTripDetails = await newTripInstance.fetchDetailsById();

    if (!originalTripDetails || originalTripDetails.length === 0) {
      inputData.errorMessage = "Original trip not found for this booking.";
      req.session.inputData = inputData;
      return res.redirect(`/Book/Book_list/${id}/edit`);
    }

    if (!newTripDetails || newTripDetails.length === 0) {
      inputData.errorMessage = "Selected trip not found";
      req.session.inputData = inputData;
      return res.redirect(`/Book/Book_list/${id}/edit`);
    }

    let seatsLeftInOriginalTrip = originalTripDetails.amount;
    let seatsLeftInNewTrip = newTripDetails.amount;

    if (oldTripId !== newTripId) {
      seatsLeftInOriginalTrip += oldAmount;

      seatsLeftInNewTrip -= newAmount;

      if (seatsLeftInNewTrip < 0) {
        inputData.errorMessage = "Not enough seats available in the new trip";
        req.session.inputData = inputData;
        return res.redirect(`/Book/Book_list/${id}/edit`);
      }

      await originalTripInstance.updateSeats(seatsLeftInOriginalTrip);
      await newTripInstance.updateSeats(seatsLeftInNewTrip);
    } else {
      const amountDifference = newAmount - oldAmount;
      seatsLeftInNewTrip -= amountDifference;

      if (seatsLeftInNewTrip < 0) {
        inputData.errorMessage =
          "Not enough seats available in the selected trip";
        req.session.inputData = inputData;
        return res.redirect(`/Book/Book_list/${id}/edit`);
      }

      await newTripInstance.updateSeats(seatsLeftInNewTrip);
    }

    const updateBooking = new Book(
      {
        trip_id: parseInt(trip),
        ppl_amount: amountP,
        count_id: parseInt(country),
      },
      id
    );

    await updateBooking.save();

    res.redirect("/Book/Book_list");
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const deleteBook = async (req, res) => {
  const bookId = req.params.id;
  let bookingDetails;

  try {
    const parsedBookId = parseInt(bookId);

    const bookingToDelete = new Book({}, parsedBookId);

    bookingDetails = await bookingToDelete.fetchById();

    if (!bookingDetails) {
      return res.status(404).json({ message: "Booking not found." });
    }

    await bookingToDelete.delete();

    const tripInstance = new Trip({}, bookingDetails.trip_id);
    const chosenTrip = await tripInstance.fetchDetailsById();

    if (!chosenTrip || chosenTrip.length === 0) {
      console.error(
        `Could not find trip with ID ${bookingDetails.trip_id} to return seats.`
      );

      return res.status(200).json({
        message:
          "Booking successfully deleted, but trip details not found for seat return.",
      });
    }

    const seatsToReturn = bookingDetails.ppl_amount;
    const updatedSeats = chosenTrip.amount + seatsToReturn;

    await tripInstance.updateSeats(updatedSeats);
    res.status(200).json({ message: "Booking successfully deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting booking." });
  }
};

module.exports = {
  getBook,
  createBook,
  getCountryTrips,
  getBookList,
  getBookEdit,
  updateBook,
  deleteBook,
};
