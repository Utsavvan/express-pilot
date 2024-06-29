const errorMiddleware = (err, req, res, next) => {
  const response = {
    error: "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production") {
    response.details = err.message;
  }
  console.log(err);
  return res.status(500).json(response);
};

module.exports = errorMiddleware;
