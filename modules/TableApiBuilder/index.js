function filterGenerator(filters) {
  const modifiedFilters = {};
  for (const key in filters) {
    if (Array.isArray(filters[key]) && filters[key].length > 0) {
      // For array values, use $in operator
      modifiedFilters[key] = { $in: filters[key] };
    } else if (typeof filters[key] === "string" && filters[key].trim() !== "") {
      // For single values, use $regex for "LIKE" operation
      modifiedFilters[key] = { $regex: new RegExp(filters[key], "i") };
    }
  }
  return modifiedFilters;
}

async function TableApiBuilder(
  Model,
  limit,
  offset,
  filters,
  additionalInfo = { excludeFields: [], sort: { createdAt: -1 } }
) {
  try {
    const selectObject = {};

    const { excludeFields, sort } = additionalInfo;

    excludeFields?.forEach((field) => {
      selectObject[field] = 0; // 0 means exclude the field
    });

    const generatedFilters = filterGenerator(filters);

    const filteredListModel = Model.find(generatedFilters)
      .select(selectObject)
      .skip(offset)
      .limit(limit);

    const sortedModal = filteredListModel.sort(sort);

    const filteredList = await sortedModal.lean();

    const updatedFilteredList = filteredList.map((item, i) => {
      item["srNo"] = offset + i + 1;
      return item;
    });

    if (!filteredList) {
      return { success: false, error: "List not found" };
    }

    const totalDocuments = await Model.countDocuments(generatedFilters);

    // Additional pagination metadata
    const paginationData = {
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      currentPage: Math.floor(offset / limit) + 1,
    };

    return {
      success: true,
      data: updatedFilteredList,
      additionalInfo: { ...paginationData },
    };
  } catch (error) {
    console.error("Error fetching filtered list:", error);
  }
}

module.exports = {
  TableApiBuilder,
};
