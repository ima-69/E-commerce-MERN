const Product = require("../../models/Product");
const { asyncHandler, createError } = require("../../utils/errorHandler");
const logger = require("../../utils/logger");

const getFilteredProducts = asyncHandler(async (req, res) => {
  const { category = [], brand = [], sortBy = "price-lowtohigh", limit } = req.query;

  let filters = {};

  if (category.length) {
    filters.category = { $in: category.split(",") };
  }

  if (brand.length) {
    filters.brand = { $in: brand.split(",") };
  }

  let sort = {};

  switch (sortBy) {
    case "price-lowtohigh":
      sort.price = 1;
      break;
    case "price-hightolow":
      sort.price = -1;
      break;
    case "title-atoz":
      sort.title = 1;
      break;
    case "title-ztoa":
      sort.title = -1;
      break;
    case "createdAt-desc":
      sort.createdAt = -1;
      break;
    case "createdAt-asc":
      sort.createdAt = 1;
      break;
    default:
      sort.price = 1;
      break;
  }

  let query = Product.find(filters).sort(sort);
  
  if (limit) {
    query = query.limit(parseInt(limit));
  }

  const products = await query;

  logger.info('Products fetched', { 
    count: products.length, 
    filters, 
    sortBy, 
    limit 
  });

  res.status(200).json({
    success: true,
    data: products,
  });
});

const getProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw createError.notFound("Product not found!");
  }

  logger.info('Product details fetched', { productId: id });

  res.status(200).json({
    success: true,
    data: product,
  });
});

module.exports = { getFilteredProducts, getProductDetails };