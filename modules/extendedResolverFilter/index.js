const { applyFilterBasedOnType } = require("./filters");

function extendedResolverFilter(
  resolver,
  schema,
  filterName = "filter",
  description = "Perform a LIKE operation on relevant fields. Supports multiple values in an array for AND operation."
) {
  return resolver.addFilterArg({
    name: filterName,
    type: "JSON",
    description: description,
    query: (query, value, resolveParams) => {
      const filter = value;

      const { model } = resolveParams;

      Object.entries(filter).forEach(([key, value]) => {
        applyFilterBasedOnType(query, key, value, schema);
      });
    },
  });
}

module.exports = extendedResolverFilter;
