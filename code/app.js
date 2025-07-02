const express = require("express");
const path = require("path");

const defaultRoutes = require("./routes/default");
const publicRoutes = require("./routes/public");
const tripRoutes = require("./routes/trips");
const countryRoutes = require("./routes/countries");
const bookRoutes = require("./routes/book");
const adminRoutes = require("./routes/admin");

const createSessionConfig = require("./config/session");
const checkAuthStatus = require("./middlewares/check-auth.middleware");
const notFoundHandler = require("./middlewares/not-found.middleware");
const errorHandler = require("./middlewares/error-handler.middleware");
const protectRoutes = require("./middlewares/route-protect.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(createSessionConfig());
app.use(checkAuthStatus);

app.use("/", publicRoutes);
app.use("/", defaultRoutes);
app.use(protectRoutes);
app.use("/admin", adminRoutes);
app.use("/", tripRoutes);
app.use("/", countryRoutes);
app.use("/", bookRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(3000);
