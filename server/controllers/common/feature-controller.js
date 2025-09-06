const Feature = require("../../models/Feature");
const { asyncHandler, createError } = require("../../utils/errorHandler");
const logger = require("../../utils/logger");

const addFeatureImage = asyncHandler(async (req, res) => {
  const { image } = req.body;

  if (!image) {
    throw createError.badRequest("Image URL is required");
  }

  const featureImages = new Feature({
    image,
  });

  await featureImages.save();

  logger.info('Feature image added', { featureId: featureImages._id });

  res.status(201).json({
    success: true,
    data: featureImages,
  });
});

const getFeatureImages = asyncHandler(async (req, res) => {
  const images = await Feature.find({});

  logger.info('Feature images fetched', { count: images.length });

  res.status(200).json({
    success: true,
    data: images,
  });
});

const deleteFeatureImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw createError.badRequest("Feature image ID is required");
  }

  const deletedImage = await Feature.findByIdAndDelete(id);

  if (!deletedImage) {
    throw createError.notFound("Feature image not found");
  }

  logger.info('Feature image deleted', { featureId: id });

  res.status(200).json({
    success: true,
    message: "Feature image deleted successfully",
    data: deletedImage,
  });
});

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };