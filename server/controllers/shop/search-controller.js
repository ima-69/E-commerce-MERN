const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    
    // Sanitize and validate keyword input
    const sanitizedKeyword = keyword?.toString().trim();
    
    if (!sanitizedKeyword || sanitizedKeyword.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
      });
    }

    if (sanitizedKeyword.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is too long (maximum 100 characters)",
      });
    }

    // Escape special regex characters to prevent regex injection
    const escapedKeyword = sanitizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create safe regex with escaped characters
    const regEx = new RegExp(escapedKeyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    const searchResults = await Product.find(createSearchQuery);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error("Error in search operation:", error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { searchProducts };