const express = require("express");
const router = express.Router();

const protectRoutes = require("../middlewares/route-protect.middleware");

const {
  getHlavnaStranka,
  getLastMinute,
  getContacts,
} = require("../controllers/default.controller");

router.get("/", getHlavnaStranka);

router.get("/Last_minute", protectRoutes, getLastMinute);

router.get("/Contacts", getContacts);

module.exports = router;
