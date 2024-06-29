const http = require("http");
const process = require("node:process");

require("module-alias/register");
const app = require("./app.js");

const { mongoConnect } = require("@Services/mongo");

const startApolloServer = require("@Services/graphql");
const buildSchema = require("./scripts/graphqlBuildSchema.js");

const PORT = process.env.PORT || 3001;

async function startServer() {
  await mongoConnect();

  await buildSchema();

  await startApolloServer();

  const server = http.createServer(app);

  // express endpoint for front end
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });

  server.listen(PORT, () => {
    console.log(`App listning on PORT http://localhost:${PORT}`);
  });
}

startServer();
