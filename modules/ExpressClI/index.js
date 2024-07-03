#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

class ExpressCLI {
  constructor() {
    this.program = new Command();
    this.init();
  }

  init() {
    this.program
      .version("0.1.0")
      .description("Custom CLI for Express.js Application");

    this.program
      .command("createModel <modelName> <tableName>")
      .description("Create a new model file")
      .action(this.createModel.bind(this));

    this.program.parse(process.argv);
  }

  createModel(modelName, tableName) {
    const fileName = modelName.toLowerCase();
    const modelsDir = path.resolve(
      __dirname,
      "..",
      "..",
      "src",
      "models",
      `${fileName}`
    );

    const filePath = path.join(modelsDir, `${fileName}.model.js`);

    const templatePath = path.resolve(
      __dirname,
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
}

if (require.main === module && process.argv.length > 2) {
  new ExpressCLI();
}

module.exports = ExpressCLI;
