const mongoose = require('mongoose');

const {{modelName}}Schema = new mongoose.Schema({
  // Define your schema here
});

const {{modelName}} = mongoose.model('{{tableName}}', {{modelName}}Schema)

module.exports = {{modelName}};
