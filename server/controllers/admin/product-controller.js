const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    
    // Check if file exists
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Check if required environment variables are set
    if (!process.env.cloudinaryCloudName || !process.env.cloudinaryApiKey || !process.env.cloudinaryApiSecret) {
      console.error("Cloudinary environment variables not configured");
      console.error("Cloud name:", process.env.cloudinaryCloudName ? "Set" : "Not set");
      console.error("API key:", process.env.cloudinaryApiKey ? "Set" : "Not set");
      console.error("API secret:", process.env.cloudinaryApiSecret ? "Set" : "Not set");
      return res.status(500).json({
        success: false,
        message: "Image upload service not configured",
      });
    }

    
    const result = await imageUploadUtil(req.file);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred during image upload",
      error: error.message,
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
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

    // Sanitize inputs
    const sanitizedData = {
      image: image?.toString().trim(),
      title: title?.toString().trim(),
      description: description?.toString().trim(),
      category: category?.toString().trim(),
      brand: brand?.toString().trim(),
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      totalStock: parseInt(totalStock),
      averageReview: averageReview ? parseFloat(averageReview) : 0
    };

    // Validate required fields
    if (!sanitizedData.title || sanitizedData.title.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Product title must be at least 3 characters long"
      });
    }

    if (!sanitizedData.description || sanitizedData.description.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Product description must be at least 10 characters long"
      });
    }

    if (!sanitizedData.price || sanitizedData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product price must be a positive number"
      });
    }

    if (!sanitizedData.totalStock || sanitizedData.totalStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Product stock must be a non-negative number"
      });
    }

    const newlyCreatedProduct = new Product({
      image: sanitizedData.image,
      title: sanitizedData.title,
      description: sanitizedData.description,
      category: sanitizedData.category,
      brand: sanitizedData.brand,
      price: sanitizedData.price,
      salePrice: sanitizedData.salePrice,
      totalStock: sanitizedData.totalStock,
      averageReview: sanitizedData.averageReview,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    console.log("Fetching all products for admin...");
    const listOfProducts = await Product.find({});
    console.log(`Found ${listOfProducts.length} products`);
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.error("Error fetching products:", e.message);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
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

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice = salePrice === "" || salePrice === undefined ? undefined : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
