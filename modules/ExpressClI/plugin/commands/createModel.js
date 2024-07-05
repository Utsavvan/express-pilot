const path = require("path");
const fs = require("fs");

function createModel(modelName, tableName, modelOptions = "mongoose") {
  const fileName = modelName.toLowerCase();
  const modelsDir = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "src",
    "models",
    `${fileName}`
  );

  const mongoFilePath = path.join(modelsDir, `${fileName}.mongo.js`);

  const mongoTemplatePath = path.resolve(
    __dirname,
    "..",
    "templates",
    "model",
    "mongoTemplate.js"
  );

  fs.mkdirSync(modelsDir, { recursive: true });

  // created mongo file
  fs.readFile(mongoTemplatePath, "utf8", (err, data) => {
    if (err) {
      return console.error(`Error reading template file: ${err}`);
    }

    const graphqlComposeImport =
      modelOptions == "graphql"
        ? `const { composeWithMongoose } = require("graphql-compose-mongoose");`
        : "";
    const graphqlCompose =
      modelOptions == "graphql"
        ? `const ${modelName}TC = composeWithMongoose(${modelName});`
        : "";

    const exportDetails =
      modelOptions == "graphql"
        ? `{ ${modelName}, ${modelName}TC }`
        : `${modelName}`;

    const mongoContent = data
      .replace(/{{modelName}}/g, modelName)
      .replace(/{{tableName}}/g, tableName)
      .replace(/{{graphqlComposeImport}}/g, graphqlComposeImport)
      .replace(/{{graphqlCompose}}/g, graphqlCompose)
      .replace(/{{exportDetails}}/g, exportDetails);

    fs.writeFileSync(mongoFilePath, mongoContent);

    console.log(`Mongo file created: ${mongoFilePath}`);
  });

  const modelFilePath = path.join(modelsDir, `${fileName}.model.js`);

  if (modelOptions == "mongoose") {
    const mongooseModelTemplatePath = path.resolve(
      __dirname,
      "..",
      "templates",
      "model",
      "mongooseModelTemplate.js"
    );

    // create mongoose model file
    fs.readFile(mongooseModelTemplatePath, "utf8", (err, data) => {
      if (err) {
        return console.error(`Error reading template file: ${err}`);
      }

      const modelContent = data
        .replace(/{{modelName}}/g, modelName)
        .replace(/{{fileName}}/g, fileName);

      fs.writeFileSync(modelFilePath, modelContent);

      console.log(`Model file created: ${modelFilePath}`);
    });

    return;
  }

  if (modelOptions == "graphql") {
    const graphqlModelTemplatePath = path.resolve(
      __dirname,
      "..",
      "templates",
      "model",
      "graphqlModelTemplate.js"
    );

    // create mongoose model file
    fs.readFile(graphqlModelTemplatePath, "utf8", (err, data) => {
      if (err) {
        return console.error(`Error reading template file: ${err}`);
      }

      const modelContent = data
        .replace(/{{modelName}}/g, modelName)
        .replace(/{{fileName}}/g, fileName);

      fs.writeFileSync(modelFilePath, modelContent);

      console.log(`Model file created: ${modelFilePath}`);
    });

    return;
  }
}

function createModelCommand(program) {
  program
    .command("createModel <modelName> <tableName> [modelOptions]")
    .description("Create a new model file")
    .action(createModel);
}

module.exports = createModelCommand;
