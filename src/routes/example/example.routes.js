const express = require("express");
const { exampleController } = require("./example.controller");

const exampleRouter = express.Router();

exampleRouter.get("/", exampleController);

module.exports = exampleRouter;
