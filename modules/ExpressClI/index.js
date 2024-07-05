const ExpressCLI = require("@utsavvan/expresscli");

const { createModelCommand } = require("./plugin");

ExpressCLI.addCommand(createModelCommand);

ExpressCLI.init();
