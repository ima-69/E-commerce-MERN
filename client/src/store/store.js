import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth-slice";

import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";

import shoppingProductSlice from "./shop/products-slice";
import shopReviewSlice from "./shop/review-slice";
import shopCartSlice from "./shop/cart-slice";
import commonFeatureSlice from "./common-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";

const store = configureStore({
    reducer: {
        auth: authReducer,

        adminProducts: adminProductsSlice,
        adminOrder: adminOrderSlice,
        
        shopProducts: shoppingProductSlice,
        shopReview: shopReviewSlice,
        shopCart: shopCartSlice,
        commonFeature: commonFeatureSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
    },
});

export default store;
