const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment files...\n');

// Server .env content
const serverEnvContent = `PORT=5000
mongodbURI=mongodb://localhost:27017/ecommerce-mern
cloudinaryCloudName=your_cloudinary_cloud_name
cloudinaryApiKey=your_cloudinary_api_key
cloudinaryApiSecret=your_cloudinary_api_secret
VITE_FRONTEND_URL=http://localhost:5173`;

// Client .env content
const clientEnvContent = `VITE_BACKEND_URL=http://localhost:5000`;

// Create server .env file
const serverEnvPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(serverEnvPath)) {
  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log('✅ Created server/.env file');
} else {
  console.log('⚠️  server/.env already exists');
}

// Create client .env file
const clientEnvPath = path.join(__dirname, 'client', '.env');
if (!fs.existsSync(clientEnvPath)) {
  fs.writeFileSync(clientEnvPath, clientEnvContent);
  console.log('✅ Created client/.env file');
} else {
  console.log('⚠️  client/.env already exists');
}

console.log('\n📝 Next steps:');
console.log('1. Update the Cloudinary credentials in server/.env');
console.log('2. Make sure MongoDB is running');
console.log('3. Start the server: cd server && npm start');
console.log('4. Start the client: cd client && npm run dev');
console.log('5. Create an admin user by updating the role in MongoDB');
console.log('\n🎉 Environment setup complete!');

