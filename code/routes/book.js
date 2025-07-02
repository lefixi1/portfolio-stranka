const express = require("express");
const router = express.Router();

const {
  getBook,
  createBook,
  getCountryTrips,
  getBookList,
  getBookEdit,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");

router.get("/Book", getBook);

router.post("/Book", createBook);

router.get("/Book/Trips/:countryId", getCountryTrips);

router.get("/Book/Book_list", getBookList);

router.get("/Book/:id/edit", getBookEdit);

router.post("/Book/:id/edit", updateBook);

router.delete("/Book/:id/delete", deleteBook);

module.exports = router;
