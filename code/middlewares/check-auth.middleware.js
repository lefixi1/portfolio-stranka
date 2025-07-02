function checkAuthStatus(req, res, next) {
  const user = req.session.user;
  if (!user) {
    return next();
  }
  res.locals.isAuth = true;
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.user = { ...req.session.user };
  next();
}

module.exports = checkAuthStatus;
