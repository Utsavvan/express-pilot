const ExpressCLI = require("expresscli");

const { createModelCommand } = require("./plugin");

ExpressCLI.addCommand(createModelCommand);

ExpressCLI.init();
