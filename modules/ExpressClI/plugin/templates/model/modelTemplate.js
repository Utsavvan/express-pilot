const {{modelName}} = require("./{{fileName}}.mogo");

const { TableApiBuilder } = require("@Modules/TableApiBuilder");

async function create{{modelName}}(data) {
  try {
    const docs = new {{modelName}}(data);

    const result = await docs.save();

    if (!result) {
      return {
        success: false,
        error: "{{modelName}} data not Inserted",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error Fetching {{modelName}}:", error);
    throw new Error(error);
  }
}

async function read{{modelName}}Details(id) {
  try {
    const result = await {{modelName}}.findById(id);

    if (!result) {
      return {
        success: false,
        error: "No {{modelName}} found",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching {{modelName}} details:", error);
    throw new Error(error);
  }
}

async function read{{modelName}}List(limit, offset, filters) {
  try {
    const tableApiOutput = await TableApiBuilder(
      {{modelName}},
      limit,
      offset,
      filters,
      (additionalInfo = {
        sort: { createdAt: -1 },
      })
    );

    return tableApiOutput;
  } catch (error) {
    console.error("Error fetching {{modelName}} list", error);
    throw new Error(error);
  }
}

async function update{{modelName}}(id, data) {
  try {
    const result = await {{modelName}}.findByIdAndDelete(id, {
      $set: data,
    });

    if (!result) {
      return {
        success: false,
        error: "{{modelName}} data not updated",
      };
    }
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error Fetching {{modelName}}:", error);
    throw new Error(error);
  }
}

async function delete{{modelName}}(id) {
  try {
    const result = await {{modelName}}.findByIdAndDelete(id);

    if (!result) {
      return {
        success: false,
        error: "{{modelName}} data not deleted",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error Fetching {{modelName}}:", error);
    throw new Error(error);
  }
}

module.exports = {
  create{{modelName}},
  read{{modelName}}Details,
  read{{modelName}}List,
  update{{modelName}},
  delete{{modelName}},
};
