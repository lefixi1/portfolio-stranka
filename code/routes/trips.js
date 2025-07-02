const express = require("express");
const router = express.Router();

const protectRoutes = require("../middlewares/route-protect.middleware");

const { getAddTrip, addTrip } = require("../controllers/trip.controller");

router.get("/Create-trip", protectRoutes, getAddTrip);

router.post("/Create-trip", protectRoutes, addTrip);

module.exports = router;
