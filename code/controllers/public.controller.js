const User = require("../models/user.model");
const Country = require("../models/country.model");
const { name } = require("ejs");

const getSignUp = async (req, res) => {
  try {
    let inputData = req.session.inputData;
    if (!inputData) {
      inputData = {
        name: "",
        surname: "",
        email: "",
        gender: "",
        password: "",
        password_repeat: "",
      };
    }

    req.session.inputData = null;

    const countries = await Country.fetchAll();
    res.render("public/Sign-up", {
      countries: countries,
      inputData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const signUp = async (req, res) => {
  const { name, surname, email, gender, password, password_repeat } = req.body;

  const inputData = {
    ...req.body,
  };

  if (password_repeat !== password || password.length < 8) {
    inputData.errorMessage = "Invalid input data";
  }

  const user = new User({ name, surname, email, gender, password });

  if (await user.existsAlready()) {
    inputData.errorMessage = "Email is in use";
  }
  if (inputData.errorMessage) {
    req.session.inputData = inputData;
    req.session.save(() => {
      res.redirect("/Sign-up");
    });
    return;
  }

  try {
    await user.signup();
    res.redirect("/Login");
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const getLogin = async (req, res) => {
  try {
    const countries = await Country.fetchAll();

    let inputData = req.session.inputData;
    if (!inputData) {
      inputData = {
        email: "",
        password: "",
      };
    }

    req.session.inputData = null;

    res.render("public/Login", {
      countries: countries,
      inputData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const inputData = {
    ...req.body,
  };

  try {
    const user = new User({ email, password });
    const existingUser = await user.getUserWithSameEmail();

    if (!existingUser) {
      inputData.errorMessage = "Invalid cretentials";
      req.session.inputData = inputData;
      req.session.save(() => {
        res.redirect("/login");
      });
      return;
    }

    const success = user.login(existingUser.password, existingUser.salt);
    if (success) {
      req.session.user = {
        id: existingUser.user_id,
        email: existingUser.email,
        name: existingUser.name,
        surname: existingUser.surname,
        gender: existingUser.gender,
      };
      req.session.isAdmin = existingUser.isAdmin === 1;
      req.session.save(() => {
        res.redirect("/");
      });
    } else {
      inputData.errorMessage = "Invalid cretentials";
      req.session.inputData = inputData;
      req.session.save(() => {
        res.redirect("/Login");
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const logout = (req, res) => {
  req.session.user = null;
  req.session.save(() => {
    res.redirect("/");
  });
};

module.exports = {
  getSignUp,
  signUp,
  getLogin,
  login,
  logout,
};
