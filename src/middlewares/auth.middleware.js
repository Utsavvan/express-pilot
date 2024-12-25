async function checkLoggedInMiddleware(req, res, next) {
  const isLoggedIn = req.isAuthenticated() && req.user;

  if (!isLoggedIn) {
    console.log("you must logged in");
    return res.status(401).json({
      error: "You must log in!",
    });
  }

  next();
}

module.exports = checkLoggedInMiddleware;
