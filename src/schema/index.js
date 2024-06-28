const { SchemaComposer } = require("graphql-compose");

const {
  ExampleQuery,
  ExampleMutation,
} = require("@Models/example/example.model");

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({ ...ExampleQuery });

schemaComposer.Mutation.addFields({ ...ExampleMutation });

// Helper function to add session-based filtering to resolvers
const addSessionFilterToResolvers = (schemaComposer) => {
  const queryFields = schemaComposer.Query.getFields();
  Object.keys(queryFields).forEach((fieldName) => {
    const originalResolver = queryFields[fieldName].resolve;
  });
};

// Apply the session filter to all resolvers
addSessionFilterToResolvers(schemaComposer);

let graphqlSchema = schemaComposer.buildSchema();

module.exports = graphqlSchema;
