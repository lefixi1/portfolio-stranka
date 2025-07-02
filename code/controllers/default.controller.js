const Country = require("../models/country.model");
const Trip = require("../models/trip.model");

const getHlavnaStranka = async (req, res) => {
  try {
    const countries = await Country.fetchAll();
    res.render("public/Hlavna_stranka", {
      countries: countries,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const getLastMinute = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).render("shared/401");
  }
  try {
    const countries = await Country.fetchAll();
    const trips = await Trip.fetchLastMinute();

    res.render("trip/Last_minute", {
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
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const getContacts = async (req, res) => {
  try {
    const countries = await Country.fetchAll();
    res.render("public/Contacts", {
      countries: countries,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

module.exports = {
  getHlavnaStranka,
  getLastMinute,
  getContacts,
};
