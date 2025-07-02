const Country = require("../models/country.model");

async function protectRoutes(req, res, next) {
  if (!res.locals.isAuth) {
    return res.status(401).render("shared/401");
  }
  if (req.path.startsWith("/admin") && !res.locals.isAdmin) {
    try {
      const countries = await Country.fetchAll();
      return res.status(403).render("shared/403", { countries });
    } catch (error) {}
  }
  next();
}

module.exports = protectRoutes;
