async function exampleController(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: "hello world",
      message: "hello world is successfully sent",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  exampleController,
};
