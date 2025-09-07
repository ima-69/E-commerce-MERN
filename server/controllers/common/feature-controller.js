const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    // Sanitize and validate image URL
    const sanitizedImage = image?.toString().trim();
    if (!sanitizedImage) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    // Basic URL validation
    try {
      new URL(sanitizedImage);
    } catch (urlError) {
      return res.status(400).json({
        success: false,
        message: "Invalid image URL format",
      });
    }

    const featureImages = new Feature({
      image: sanitizedImage,
    });

    await featureImages.save();

    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (e) {
    console.error("Error adding feature image:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Sanitize and validate the ID
    const sanitizedId = id?.toString().trim();
    if (!sanitizedId) {
      return res.status(400).json({
        success: false,
        message: "Feature image ID is required",
      });
    }

    const deletedImage = await Feature.findByIdAndDelete(sanitizedId);

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Feature image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feature image deleted successfully",
      data: deletedImage,
    });
  } catch (e) {
    console.error("Error deleting feature image:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };