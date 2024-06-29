const { SchemaComposer } = require("graphql-compose");

const {
  ExampleQuery,
  ExampleMutation,
} = require("@Models/example/example.model");

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({ ...ExampleQuery });

schemaComposer.Mutation.addFields({ ...ExampleMutation });

let graphqlSchema = schemaComposer.buildSchema();

module.exports = graphqlSchema;
