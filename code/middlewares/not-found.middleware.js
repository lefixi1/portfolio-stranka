const Country = require("../models/country.model");

const notFoundHandler = async (req, res) => {
  try {
    const countries = await Country.fetchAll();
    res.status(404).render("shared/404", { countries });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

module.exports = notFoundHandler;
