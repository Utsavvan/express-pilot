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

  const filePath = path.join(modelsDir, `${fileName}.model.js`);

  const templatePath = path.resolve(
    __dirname,
    "..",
    "templates",
    "modelTemplate.js"
  );

  fs.readFile(templatePath, "utf8", (err, data) => {
    if (err) {
      return console.error(`Error reading template file: ${err}`);
    }

    const modelContent = data
      .replace(/{{modelName}}/g, modelName)
      .replace(/{{tableName}}/g, tableName);

    fs.mkdirSync(modelsDir, { recursive: true });

    fs.writeFileSync(filePath, modelContent);

    console.log(`Model file created: ${filePath}`);
  });
}

function createModelCommand(program) {
  program
    .command("createModel <modelName> <tableName>")
    .description("Create a new model file")
    .action(createModel);
}

module.exports = createModelCommand;
