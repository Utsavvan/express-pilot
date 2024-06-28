const { ApolloServer } = require("apollo-server-express");
const graphqlSchema = require("@Schema");
const app = require("@Src/app");

const { corsOptions } = require("@Config/helperVariables");

async function startApolloServer() {
  const graphqlServer = new ApolloServer({
    schema: graphqlSchema,
    context: ({ req }) => {
      // Extract the session cookie and add it to the context
      const location = req.cookies.location || "";
      return { location };
    },
    cors: corsOptions,
    playground: process.env.NODE_ENV === "development" ? true : false,
    introspection: true,
    tracing: true,
    path: "/graphql",
  });

  await graphqlServer.start();

  console.log("Apolo server is started");

  graphqlServer.applyMiddleware({
    app,
    path: "/graphql",
    cors: corsOptions,
    onHealthCheck: () =>
      // eslint-disable-next-line no-undef
      new Promise((resolve, reject) => {
        if (mongoose.connection.readyState > 0) {
          resolve();
        } else {
          reject();
        }
      }),
  });
}

module.exports = startApolloServer;
