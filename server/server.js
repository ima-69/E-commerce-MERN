const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');


dotenv.config();

const authRouter = require("./routes/auth/auth-routes");
const adminProductRouter = require("./routes/admin/products-routes");
const shopProductRouter = require("./routes/shop/products-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopCartRouter = require("./routes/shop/cart-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

mongoose.connect(process.env.mongodbURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: 'http://localhost:5173',
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
app.use("/api/admin/products", adminProductRouter);
app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});