# E-commerce MERN Stack Application

A full-stack e-commerce application built with MongoDB, Express.js, React, and Node.js. This project features a complete shopping experience with user authentication, product management, cart functionality, order processing, and admin dashboard.

## 🚀 Features

- **User Authentication & Authorization**
  - Auth0 Google OAuth integration
  - Secure JWT-based authentication
  - Guest cart support
  - Session management

- **Product Management**
  - Product listing with pagination
  - Advanced filtering and sorting
  - Product search functionality
  - Product categories (Men, Women, Kids, Accessories, Footwear)
  - Multiple brands support

- **Shopping Experience**
  - Shopping cart with add/remove functionality
  - Wishlist management
  - Product details with image gallery
  - Order tracking
  - Address management

- **Admin Dashboard**
  - Product management (CRUD operations)
  - Order management
  - User management
  - Dashboard analytics

- **Payment Integration**
  - PayPal payment gateway
  - Order confirmation system

- **Responsive Design**
  - Mobile-first approach
  - Modern UI with Tailwind CSS
  - Dark/Light theme support

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **PayPal SDK** - Payment processing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

### Required Services
- **MongoDB Atlas** - Cloud database (create free account at [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Auth0 Account** - For Google authentication (create free account at [Auth0](https://auth0.com))
- **Cloudinary Account** - For image storage (create free account at [Cloudinary](https://cloudinary.com))
- **PayPal Developer Account** - For payment processing (create account at [PayPal Developer](https://developer.paypal.com))
- **Gmail App Password** - For email notifications (enable 2FA and generate app password)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ima-69/E-commerce-MERN.git
cd E-commerce-MERN
```

### 2. Environment Setup

#### Server Environment (.env)
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend and Backend URLs
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:5000

# Database (MongoDB Atlas)
mongodbURI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/ecommerce-mern?retryWrites=true&w=majority

# JWT Configuration (REQUIRED)
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
CLIENT_SECRET_KEY=your_client_secret_key_here_make_it_long_and_secure

# Cloudinary Configuration (for image uploads)
cloudinaryCloudName=your_cloudinary_cloud_name
cloudinaryApiKey=your_cloudinary_api_key
cloudinaryApiSecret=your_cloudinary_api_secret

# PayPal Configuration (Sandbox)
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_SECRET=your_paypal_sandbox_secret
PAYPAL_API=https://api-m.sandbox.paypal.com

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Auth0 Configuration
AUTHO_DOMAIN=your_auth0_domain.auth0.com
AUTHO_CLIENT_ID=your_auth0_client_id
AUTHO_CLIENT_SECRET=your_auth0_client_secret
AUTHO_CALLBACK_URL=http://localhost:5000/api/auth0/callback

# Session Secret
SESSION_SECRET=your_session_secret_here_make_it_long_and_secure
```

#### Client Environment (.env)
Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_NAME=E-commerce MERN
```

### 3. Install Dependencies

#### Install Server Dependencies
```bash
cd server
npm install
```

#### Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Database Setup

The application uses **MongoDB Atlas** (cloud database). You need to:

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace the `mongodbURI` in your `.env` file with your actual connection string

The database will automatically create the necessary collections when you start the server.

### 5. External Services Setup

#### Auth0 Setup
1. Create an Auth0 account
2. Create a new application
3. Configure Google Social Connection
4. Set callback URL: `http://localhost:5000/api/auth0/callback`
5. Copy your domain, client ID, and client secret to `.env`

#### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret from dashboard
3. Add them to your `.env` file

#### PayPal Setup
1. Create a PayPal Developer account
2. Create a new app in sandbox mode
3. Copy client ID and secret to `.env`

#### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail
2. Generate an App Password
3. Use your Gmail and app password in `.env`

### 6. Populate Database with Sample Data

To populate the database with sample products:

```bash
cd server
npm run seed
```

This will add 75 sample products across all categories.

### 7. Run the Application

#### Start the Server
```bash
cd server
npm run dev
```

#### Start the Client (in a new terminal)
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
E-commerce-MERN/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── admin-view/ # Admin dashboard components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── common/     # Shared components
│   │   │   ├── shopping-view/ # Shopping components
│   │   │   └── ui/         # UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── config/         # Configuration files
│   │   └── lib/            # Utility functions
│   └── public/             # Static assets
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── helpers/           # Helper functions
│   └── server.js          # Server entry point
└── README.md
```

## 🔧 Available Scripts

### Server Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
```

### Client Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Products
- `GET /api/shop/products/get` - Get all products (with pagination)
- `GET /api/shop/products/get/:id` - Get product by ID
- `GET /api/shop/products/search` - Search products

### Cart & Orders
- `GET /api/shop/cart/get` - Get user cart
- `POST /api/shop/cart/add` - Add item to cart
- `POST /api/shop/orders/create` - Create order
- `GET /api/shop/orders/get` - Get user orders

### Admin
- `POST /api/admin/products/create` - Create product
- `PUT /api/admin/products/update/:id` - Update product
- `DELETE /api/admin/products/delete/:id` - Delete product
- `GET /api/admin/orders/get` - Get all orders
- `GET /api/admin/users/get` - Get all users

## 🔐 Environment Variables Reference

### Required Server Variables
- `mongodbURI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens (REQUIRED)
- `CLIENT_SECRET_KEY` - Additional JWT secret key (REQUIRED)
- `EMAIL_USER` - Email for sending notifications
- `EMAIL_PASS` - Email app password
- `AUTHO_DOMAIN` - Auth0 domain for Google login
- `AUTHO_CLIENT_ID` - Auth0 client ID
- `AUTHO_CLIENT_SECRET` - Auth0 client secret
- `AUTHO_CALLBACK_URL` - Auth0 callback URL
- `SESSION_SECRET` - Session secret for secure sessions

### Optional Server Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `USE_HTTPS` - Enable HTTPS (true/false)
- `HTTPS_PORT` - HTTPS port (default: 5443)
- `VITE_FRONTEND_URL` - Frontend URL
- `VITE_BACKEND_URL` - Backend API URL
- `cloudinaryCloudName` - Cloudinary cloud name for image uploads
- `cloudinaryApiKey` - Cloudinary API key
- `cloudinaryApiSecret` - Cloudinary API secret
- `PAYPAL_CLIENT_ID` - PayPal sandbox client ID
- `PAYPAL_SECRET` - PayPal sandbox secret
- `PAYPAL_API` - PayPal API endpoint (sandbox)
- `EMAIL_SERVICE` - Email service provider (gmail)

### Required Client Variables
- `VITE_BACKEND_URL` - Backend API URL


## 👨‍💻 Author

**Ima-69**
- GitHub: [@ima-69](https://github.com/ima-69)
- Repository: [E-commerce-MERN](https://github.com/ima-69/E-commerce-MERN)


---

**Happy Coding! 🚀**