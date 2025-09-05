const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

const authRouter = require("./routes/auth/auth-routes");
const profileRouter = require("./routes/auth/profile-routes");

const adminProductRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductRouter = require("./routes/shop/products-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopWishlistRouter = require("./routes/shop/wishlist-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

mongoose
    .connect(process.env.mongodbURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.VITE_FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders : [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/wishlist", shopWishlistRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});