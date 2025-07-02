const express = require("express");
const router = express.Router();

const {
  getSignUp,
  signUp,
  getLogin,
  login,
  logout,
} = require("../controllers/public.controller");

router.get("/Sign-up", getSignUp);

router.post("/Sign-up", signUp);

router.get("/Login", getLogin);

router.post("/Login", login);

router.post("/logout", logout);

module.exports = router;
