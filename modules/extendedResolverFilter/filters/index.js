// Function to create regex pattern or direct number match
function createCondition(key, value) {
  const skipKeys = ["_id", "id"];

  if (skipKeys.includes(key)) {
    return value;
  }

  if (isDateString(value)) {
    const date = new Date(value);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    return {
      $gte: date,
      $lt: nextDay,
    };
  }

  if (typeof value === "string") {
    return { $regex: new RegExp(value, "i") };
  }

  return value;
}

// Function to apply the appropriate filter based on the value type
function applyFilterBasedOnType(query, key, value, schema) {
  // Check if the field is valid in the schema
  if (key === "$or") {
    return applyORValueFilter(query, key, value);
  }

  if (key === "dateRange") {
    return applyDateRangeFilter(query, key, value);
  }

  if (schema?.schema.paths[key]) {
    if (Array.isArray(value) && value?.length > 0) {
      return applyMultiValueFilter(query, key, value); // Handle array values with multi-value filter
    } else if (
      (value && typeof value === "string") ||
      typeof value === "number"
    ) {
      return applySingleValueFilter(query, key, value); // Handle single values with single-value filter
    }
  }

  return {};
}

// Function to apply single value filter immutably
function applySingleValueFilter(query, key, value) {
  // Example implementation for single value filter
  query[key] = createCondition(key, value);
}

function applyMultiValueFilter(query, key, values) {
  // Example implementation for multi value filter
  query[key] = {
    $in: values.map((value) => createCondition(key, value)),
  };
}

function applyORValueFilter(query, key, values) {
  query.$or = query.$or || [];

  Object.entries(values).forEach(([key, value]) => {
    // Create a condition for each key-value pair and add it to the $or array
    const fieldCondition = { [key]: createCondition(key, value) };
    query.$or.push(fieldCondition);
  });
}

function applyDateRangeFilter(query, key, values) {
  // query.$or.push({ [key]: condition });

  Object.entries(values).forEach(([key, value]) => {
    const condition = {};
    if (value.from) condition.$gte = value.from; // Greater than or equal to "from"
    if (value.to) condition.$lte = value.to; // Less than or equal to "to"

    query[key] = condition;
  });
}

function isDateString(inputString) {
  const date = new Date(inputString);

  return (
    !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === inputString
  );
}

module.exports = {
  applyFilterBasedOnType,

  applySingleValueFilter,
  applyMultiValueFilter,
};
