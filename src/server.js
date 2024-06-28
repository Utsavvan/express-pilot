const app = require("./app.js");
const http = require("http");
const process = require("node:process");
require("module-alias/register");

const { mongoConnect } = require("@Services/mongo");

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();

  server.listen(PORT, () => {
    console.log(`App listning on PORT http://localhost:${PORT}`);
  });
}

startServer();
