const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
let path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync("./public/images", { recursive: true });
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/avif",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = {
  fileFilter,
  storage,
};
