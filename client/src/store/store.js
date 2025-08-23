import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import shoppingProductSlice from "./shop/products-slice";
import shopReviewSlice from "./shop/review-slice";
import shopCartSlice from "./shop/cart-slice";
import commonFeatureSlice from "./common-slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: adminProductsSlice,
        shopProducts: shoppingProductSlice,
        shopReview: shopReviewSlice,
        shopCart: shopCartSlice,
        commonFeature: commonFeatureSlice,
    },
});

export default store;
