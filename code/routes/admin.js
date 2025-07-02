const express = require("express");
const router = express.Router();

const {
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/admin.controller");
const protectRoutes = require("../middlewares/route-protect.middleware");
const {
  getEditTrip,
  updateTrip,
  deleteTrip,
  deleteCountry,
  updateCountry,
  getEditCountry,
  getAddCountry,
  addCountry,
} = require("../controllers/countries.controller");

router.get("/users-list", protectRoutes, getUsers);
router.get("/user/:id/edit", protectRoutes, getSingleUser);
router.post("/user/:id/edit", protectRoutes, updateUser);
router.delete("/user/:id/delete", protectRoutes, deleteUser);

router.get("/Add-country", protectRoutes, getAddCountry);

router.post("/Add-country", protectRoutes, addCountry);

router.get("/Countries/:countryId/edit", getEditCountry);

router.post("/Countries/:countryId/edit", updateCountry);

router.delete("/Countries/:countryId/delete", deleteCountry);

router.get("/Countries/:countryName/:id/edit", getEditTrip);

router.post("/Countries/:countryName/:id/edit", updateTrip);

router.delete("/Countries/:countryName/:id/delete", deleteTrip);

module.exports = router;
