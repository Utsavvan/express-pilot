const path = require("path");
const fs = require("fs");

function createModel(modelName, tableName) {
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

    const mongoContent = data
      .replace(/{{modelName}}/g, modelName)
      .replace(/{{tableName}}/g, tableName);

    fs.writeFileSync(mongoFilePath, mongoContent);

    console.log(`Mongo file created: ${mongoFilePath}`);
  });

  const modelFilePath = path.join(modelsDir, `${fileName}.model.js`);

  const modelTemplatePath = path.resolve(
    __dirname,
    "..",
    "templates",
    "model",
    "modelTemplate.js"
  );

  // create model file
  fs.readFile(modelTemplatePath, "utf8", (err, data) => {
    if (err) {
      return console.error(`Error reading template file: ${err}`);
    }

    const modelContent = data
      .replace(/{{modelName}}/g, modelName)
      .replace(/{{fileName}}/g, fileName);

    fs.writeFileSync(modelFilePath, modelContent);

    console.log(`Model file created: ${modelFilePath}`);
  });
}

function createModelCommand(program) {
  program
    .command("createModel <modelName> <tableName>")
    .description("Create a new model file")
    .action(createModel);
}

module.exports = createModelCommand;
