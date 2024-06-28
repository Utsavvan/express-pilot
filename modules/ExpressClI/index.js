#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

class ExpressClI {
  constructor() {
    this.program = new Command();
    this.init();
  }

  init() {
    this.program
      .version("0.1.0")
      .description("Custom CLI for Express.js Application");

    this.program
      .command("createModel <modelFilename> <tableName>")
      .description("Create a new model file")
      .action(this.createModel.bind(this));

    this.program.parse(process.argv);
  }

  createModel(modelFilename, tableName) {
    const modelsDir = path.resolve(__dirname, "../src/models");
    const filePath = path.join(modelsDir, `${modelFilename}.model.js`);
    const templatePath = path.resolve(__dirname, "templates/modelTemplate.js");

    fs.readFile(templatePath, "utf8", (err, data) => {
      if (err) {
        return console.error(`Error reading template file: ${err}`);
      }

      const modelContent = data
        .replace(/{{modelName}}/g, modelFilename)
        .replace(/{{tableName}}/g, tableName);

      fs.mkdirSync(modelsDir, { recursive: true });

      fs.writeFileSync(filePath, modelContent);

      console.log(`Model file created: ${filePath}`);
    });
  }
}

module.exports = CLI;
