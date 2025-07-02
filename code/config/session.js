const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const createSessionStore = () => {
  const sessionStore = new MySQLStore({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "10.41UnizA",
    database: "session_data",
  });
  return sessionStore;
};

const createSessionConfig = () => {
  return session({
    secret: "superSecret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
  });
};

module.exports = createSessionConfig;
