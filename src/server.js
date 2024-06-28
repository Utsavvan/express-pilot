const http = require("http");
const process = require("node:process");

require("module-alias/register");
const app = require("./app.js");

const { mongoConnect } = require("@Services/mongo");

const startApolloServer = require("@Services/graphql");
const buildSchema = require("./scripts/graphqlBuildSchema.js");

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();

  await buildSchema();

  await startApolloServer();

  server.listen(PORT, () => {
    console.log(`App listning on PORT http://localhost:${PORT}`);
  });
}

startServer();
