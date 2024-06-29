const { Example, ExampleTC } = require("./example.mongo");

const extendedResolverFilter = require("@Modules/extendedResolverFilter");

const paginationResolver = ExampleTC.getResolver("pagination");

// Access the resolver's TypeComposer
const extendedPaginationResolver = extendedResolverFilter(
  paginationResolver,
  Example
);

ExampleTC.setResolver("pagination", extendedPaginationResolver);

const ExampleQuery = {
  exampleById: ExampleTC.getResolver("findById"),
  exampleByIds: ExampleTC.getResolver("findByIds"),
  exampleOne: ExampleTC.getResolver("findOne"),
  exampleMany: ExampleTC.getResolver("findMany"),
  exampleCount: ExampleTC.getResolver("count"),
  examplePagination: ExampleTC.getResolver("pagination"),
};

const ExampleMutation = {
  exampleCreateOne: ExampleTC.getResolver("createOne"),
  exampleCreateMany: ExampleTC.getResolver("createMany"),
  exampleUpdateById: ExampleTC.getResolver("updateById"),
  exampleUpdateOne: ExampleTC.getResolver("updateOne"),
  exampleUpdateMany: ExampleTC.getResolver("updateMany"),
  exampleRemoveById: ExampleTC.getResolver("removeById"),
  exampleRemoveOne: ExampleTC.getResolver("removeOne"),
  exampleRemoveMany: ExampleTC.getResolver("removeMany"),
};

module.exports = { ExampleQuery, ExampleMutation };
