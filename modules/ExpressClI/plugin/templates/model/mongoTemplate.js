const mongoose = require('mongoose');
{{graphqlComposeImport}}

const {{modelName}}Schema = new mongoose.Schema({
  // Define your schema here
});

const {{modelName}} = mongoose.model('{{tableName}}', {{modelName}}Schema)

{{graphqlCompose}}

module.exports = {{exportDetails}};
