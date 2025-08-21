const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check required environment variables
const requiredEnvVars = [
  'mongodbURI',
  'cloudinaryCloudName',
  'cloudinaryApiKey',
  'cloudinaryApiSecret'
];

console.log('🔍 Checking environment variables...\n');

let allConfigured = true;

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: Configured`);
  } else {
    console.log(`❌ ${envVar}: Missing`);
    allConfigured = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allConfigured) {
  console.log('🎉 All required environment variables are configured!');
} else {
  console.log('⚠️  Some environment variables are missing.');
  console.log('\nPlease create a .env file in the server directory with:');
  console.log('mongodbURI=your_mongodb_connection_string');
  console.log('cloudinaryCloudName=your_cloudinary_cloud_name');
  console.log('cloudinaryApiKey=your_cloudinary_api_key');
  console.log('cloudinaryApiSecret=your_cloudinary_api_secret');
}

console.log('\n' + '='.repeat(50));
