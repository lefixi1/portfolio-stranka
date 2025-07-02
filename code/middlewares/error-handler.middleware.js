const Country = require("../models/country.model");

const errorHandler = async (error, req, res, next) => {
  console.log(error);
  try {
    const countries = await Country.fetchAll();
    res.status(500).render("shared/500", { countries });
  } catch (error) {
    res.status(500).render("shared/500");
  }
};

module.exports = errorHandler;
