const User = require("../models/user.model");
const Country = require("../models/country.model");

const getUsers = async (req, res) => {
  try {
    const countries = await Country.fetchAll();
    const users = await User.fetchAll();
    const head = [
      {
        id: "name",
        value: "Meno",
      },
      {
        id: "surname",
        value: "Surname",
      },
      {
        id: "gender",
        value: "Gender",
      },
      {
        id: "email",
        value: "Email",
      },
      {
        id: "action",
        value: "Action",
      },
    ];
    res.render("admin/users-list", {
      users: users.filter((item) => !item.isAdmin),
      head,
      countries,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("shared/500");
  }
};

const getSingleUser = async (req, res) => {
  try {
    const countries = await Country.fetchAll();
    const user = await User.findById(req.params.id);
    let inputData = req.session.inputData;
    if (!inputData) {
      inputData = {
        name: this.name,
        surname: this.surname,
        email: this.email,
      };
    }

    req.session.inputData = null;

    res.render("admin/userEdit", { user, countries, inputData });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.status(200).send();
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, surname, email } = req.body;
    const user = await User.findById(req.params.id);
    user.name = name;
    user.surname = surname;
    user.email = email;
    const inputData = {
      ...req.body,
    };
    await user.update();
    res.redirect("/admin/users-list");
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
};

module.exports = {
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
