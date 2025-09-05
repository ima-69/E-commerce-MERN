const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const { asyncHandler, createError } = require("../../utils/errorHandler");
const logger = require("../../utils/logger");

const handleImageUpload = asyncHandler(async (req, res) => {
  // Check if file exists
  if (!req.file) {
    throw createError.badRequest("No file uploaded");
  }

  // Check if required environment variables are set
  if (!process.env.cloudinaryCloudName || !process.env.cloudinaryApiKey || !process.env.cloudinaryApiSecret) {
    logger.error("Cloudinary environment variables not configured", {
      cloudName: process.env.cloudinaryCloudName ? "Set" : "Not set",
      apiKey: process.env.cloudinaryApiKey ? "Set" : "Not set",
      apiSecret: process.env.cloudinaryApiSecret ? "Set" : "Not set"
    });
    throw createError.serverError("Image upload service not configured");
  }

  const result = await imageUploadUtil(req.file);

  logger.info('Image uploaded successfully', { 
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  });

  res.json({
    success: true,
    result,
  });
});

//add a new product
const addProduct = asyncHandler(async (req, res) => {
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    averageReview,
  } = req.body;

  // Validate required fields
  if (!title || !price || !category || !brand) {
    throw createError.badRequest("Title, price, category, and brand are required");
  }

  const newlyCreatedProduct = new Product({
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice: salePrice === "" ? undefined : salePrice,
    totalStock: totalStock || 0,
    averageReview: averageReview || 0,
  });

  await newlyCreatedProduct.save();
  
  logger.info('New product created', { 
    productId: newlyCreatedProduct._id,
    title: newlyCreatedProduct.title,
    category: newlyCreatedProduct.category,
    price: newlyCreatedProduct.price
  });
  
  res.status(201).json({
    success: true,
    data: newlyCreatedProduct,
  });
});

//fetch all products
const fetchAllProducts = asyncHandler(async (req, res) => {
  const listOfProducts = await Product.find({});
  
  logger.info('All products fetched', { count: listOfProducts.length });
  
  res.status(200).json({
    success: true,
    data: listOfProducts,
  });
});

//edit a product
const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    averageReview,
  } = req.body;

  const findProduct = await Product.findById(id);
  if (!findProduct) {
    throw createError.notFound("Product not found");
  }

  // Update fields only if provided
  if (title !== undefined) findProduct.title = title;
  if (description !== undefined) findProduct.description = description;
  if (category !== undefined) findProduct.category = category;
  if (brand !== undefined) findProduct.brand = brand;
  if (price !== undefined) findProduct.price = price === "" ? 0 : price;
  if (salePrice !== undefined) findProduct.salePrice = salePrice === "" ? undefined : salePrice;
  if (totalStock !== undefined) findProduct.totalStock = totalStock;
  if (image !== undefined) findProduct.image = image;
  if (averageReview !== undefined) findProduct.averageReview = averageReview;

  await findProduct.save();
  
  logger.info('Product updated', { 
    productId: findProduct._id,
    title: findProduct.title,
    updatedFields: Object.keys(req.body)
  });
  
  res.status(200).json({
    success: true,
    data: findProduct,
  });
});

//delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  
  if (!product) {
    throw createError.notFound("Product not found");
  }
  
  logger.info('Product deleted', { 
    productId: id,
    title: product.title
  });
  
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
