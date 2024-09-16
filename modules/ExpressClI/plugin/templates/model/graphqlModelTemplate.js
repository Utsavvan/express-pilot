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
  {{modelName}}ById: {{modelName}}TC.getResolver("findById"),
  {{modelName}}ByIds: {{modelName}}TC.getResolver("findByIds"),
  {{modelName}}One: {{modelName}}TC.getResolver("findOne"),
  {{modelName}}Many: {{modelName}}TC.getResolver("findMany"),
  {{modelName}}Count: {{modelName}}TC.getResolver("count"),
  {{modelName}}Pagination: {{modelName}}TC.getResolver("pagination"),
};

const {{modelName}}Mutation = {
 {{modelName}}CreateOne: {{modelName}}TC.getResolver("createOne"),
 {{modelName}}CreateMany: {{modelName}}TC.getResolver("createMany"),
 {{modelName}}UpdateById: {{modelName}}TC.getResolver("updateById"),
 {{modelName}}UpdateOne: {{modelName}}TC.getResolver("updateOne"),
 {{modelName}}UpdateMany: {{modelName}}TC.getResolver("updateMany"),
 {{modelName}}RemoveById: {{modelName}}TC.getResolver("removeById"),
 {{modelName}}RemoveOne: {{modelName}}TC.getResolver("removeOne"),
 {{modelName}}RemoveMany: {{modelName}}TC.getResolver("removeMany"),
};

module.exports = { {{modelName}}Query, {{modelName}}Mutation };
