
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.cloudinaryCloudName,
  api_key: process.env.cloudinaryApiKey,
  api_secret: process.env.cloudinaryApiSecret,
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  try {
    if (!file) {
      throw new Error("No file provided for upload");
    }

    console.log("Starting Cloudinary upload...");
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      timeout: 60000, // 60 second timeout
    });

    console.log("Cloudinary upload completed successfully");
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };