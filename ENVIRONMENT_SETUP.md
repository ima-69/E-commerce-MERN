# Environment Setup Guide

## Server Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
mongodbURI=mongodb://localhost:27017/ecommerce-mern

# JWT Configuration (REQUIRED)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
CLIENT_SECRET_KEY=your_super_secret_jwt_key_here_change_this_in_production

# Cloudinary Configuration
cloudinaryCloudName=your_cloudinary_cloud_name
cloudinaryApiKey=your_cloudinary_api_key
cloudinaryApiSecret=your_cloudinary_api_secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
VITE_FRONTEND_URL=http://localhost:5173

# PayPal Configuration (if using PayPal)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
```

## Client Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Setup Instructions

1. **Database Setup**: Make sure MongoDB is running on your system
2. **Cloudinary Setup**: Sign up for a free Cloudinary account and get your credentials
3. **Environment Files**: Create the `.env` files as shown above
4. **Install Dependencies**: Run `npm install` in both `client` and `server` directories
5. **Start the Application**:
   - Start the server: `cd server && npm start`
   - Start the client: `cd client && npm run dev`

## Admin Access

To access the admin panel:
1. Register a new user account
2. Manually update the user's role to "admin" in the MongoDB database:
   ```javascript
   db.users.updateOne({email: "your-email@example.com"}, {$set: {role: "admin"}})
   ```
3. Log in with that account to access admin features

## Troubleshooting

- If admin products/orders are not showing, check:
  1. Server is running on port 5000
  2. Environment variables are properly set
  3. User has admin role
  4. MongoDB connection is working
  5. Check browser console for any API errors

