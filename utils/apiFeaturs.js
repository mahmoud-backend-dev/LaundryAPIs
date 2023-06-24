class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  };
  paginate(countDocument) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination
    const pagination = {};
    pagination.page = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocument / limit);

    // Next Page
    if (countDocument > endIndex)
      pagination.next = page + 1;
    // Previous Page
    if (skip > 0)
      pagination.prev = page - 1
    
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this
  }
};


module.exports = ApiFeatures;