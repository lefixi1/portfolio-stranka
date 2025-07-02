const multer = require("multer");
const { fileFilter, storage } = require("../util/fileUpload");
const Country = require("../models/country.model");
const Trip = require("../models/trip.model");

let upload = multer({ storage, fileFilter, limits: { fileSize: "10MB" } });

const getAddTrip = async (req, res) => {
  let inputData = req.session.inputData;

  if (!inputData) {
    inputData = {
      tittle: "",
      description: "",
      amountP: "",
      city: "",
      dateD: "",
      dateR: "",
      typeR: "",
      typeT: "",
      price: "",
      oldPrice: "",
      country: "",
    };
  }

  req.session.inputData = null;
  try {
    const countries = await Country.fetchAll();
    res.render("admin/Create-trip", { countries, inputData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("shared/500");
  }
};

const addTrip = [
  upload.single("image"),
  async (req, res) => {
    const {
      tittle,
      description,
      amountP,
      city,
      dateD,
      dateR,
      typeR,
      typeT,
      price,
      oldPrice,
      country,
    } = req.body;
    let imageLocation = "";

    if (req.file.path) {
      imageLocation = req.file.filename;
    }

    const inputData = {
      ...req.body,
    };

    try {
      const countries = await Country.fetchAll();
      const choseCountry = countries.find(
        (c) => c.count_id === parseInt(country)
      );

      if (!choseCountry) {
        inputData.errorMessage = "Country not found";
      }

      const existingTrip = new Trip({
        trip_tit: tittle,
        count_id: parseInt(country),
      });
      const exists = await existingTrip.fetchExists();

      if (exists) {
        inputData.errorMessage =
          "Trip with the same title already exists in this country.";
      }

      const trip = new Trip({
        trip_tit: tittle,
        trip_descr: description,
        amount: amountP,
        city,
        date_dep: dateD,
        date_ret: dateR,
        room_type: typeR,
        trip_type: typeT,
        price: parseFloat(price),
        old_price: parseFloat(oldPrice),
        imageLocation,
        count_id: parseInt(country),
      });
      await trip.save();

      res.redirect(`/Countries/${choseCountry.count_name}`);
    } catch (error) {
      console.log(error.message);
      res.status(500).render("shared/500");
    }
  },
];

module.exports = {
  getAddTrip,
  addTrip,
};
