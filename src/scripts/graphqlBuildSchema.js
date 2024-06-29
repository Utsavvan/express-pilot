const fs = require("fs-extra");
const path = require("path");
const { graphql } = require("graphql");
const { introspectionQuery, printSchema } = require("graphql/utilities");

const Schema = require("../schema");

async function buildSchema() {
  // Define the base directory for schema files
  const schemaDir = path.join(__dirname, "..", "schema");

  // Ensure the schema directory exists
  await fs.ensureDir(schemaDir);

  // Define file paths for the schema files
  const schemaJsonPath = path.join(schemaDir, "schema.graphql.json");
  const schemaTxtPath = path.join(schemaDir, "schema.graphql.txt");

  // Perform GraphQL introspection to get the schema JSON
  const schemaJson = await graphql({
    schema: Schema,
    source: introspectionQuery,
  });

  // Write the schema JSON to a file
  await fs.writeFile(
    schemaJsonPath,
    JSON.stringify(schemaJson, null, 2),
    "utf-8"
  );

  // Generate and write the schema in human-readable format
  const schemaText = printSchema(Schema);
  await fs.writeFile(schemaTxtPath, schemaText, "utf-8");

  console.log("graphql schemas is generated");
}

module.exports = buildSchema;
