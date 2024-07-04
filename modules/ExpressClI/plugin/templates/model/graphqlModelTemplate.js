const { {{modelName}}, {{modelName}}TC } = require("./{{fileName}}.mongo");

const extendedResolverFilter = require("@Modules/extendedResolverFilter");

const paginationResolver = {{modelName}}TC.getResolver("pagination");

// Access the resolver's TypeComposer
const extendedPaginationResolver = extendedResolverFilter(
  paginationResolver,
  {{modelName}}
);

{{modelName}}TC.setResolver("pagination", extendedPaginationResolver);

const {{modelName}}Query = {
  exampleById: {{modelName}}TC.getResolver("findById"),
  exampleByIds: {{modelName}}TC.getResolver("findByIds"),
  exampleOne: {{modelName}}TC.getResolver("findOne"),
  exampleMany: {{modelName}}TC.getResolver("findMany"),
  exampleCount: {{modelName}}TC.getResolver("count"),
  examplePagination: {{modelName}}TC.getResolver("pagination"),
};

const {{modelName}}Mutation = {
  exampleCreateOne: {{modelName}}TC.getResolver("createOne"),
  exampleCreateMany: {{modelName}}TC.getResolver("createMany"),
  exampleUpdateById: {{modelName}}TC.getResolver("updateById"),
  exampleUpdateOne: {{modelName}}TC.getResolver("updateOne"),
  exampleUpdateMany: {{modelName}}TC.getResolver("updateMany"),
  exampleRemoveById: {{modelName}}TC.getResolver("removeById"),
  exampleRemoveOne: {{modelName}}TC.getResolver("removeOne"),
  exampleRemoveMany: {{modelName}}TC.getResolver("removeMany"),
};

module.exports = { {{modelName}}Query, {{modelName}}Mutation };
