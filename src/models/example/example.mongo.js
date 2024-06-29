const mongoose = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");

const exampleSchema = new mongoose.Schema({
  testField: String,
});

const Example = mongoose.model("example", exampleSchema);

const ExampleTC = composeWithMongoose(Example);

module.exports = {
  Example,
  ExampleTC,
};
