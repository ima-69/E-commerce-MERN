import { createSlice } from "@reduxjs/toolkit";

// Load guest cart from localStorage on initialization
const loadGuestCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('guestCart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading guest cart from storage:', error);
    return [];
  }
};

// Save guest cart to localStorage
const saveGuestCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('guestCart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving guest cart to storage:', error);
  }
};

const initialState = {
  guestCartItems: loadGuestCartFromStorage(),
  guestCartId: null, // We'll use a temporary ID for guest cart
};

const guestCartSlice = createSlice({
  name: "guestCart",
  initialState,
  reducers: {
    addToGuestCart: (state, action) => {
      const { productId, quantity, product } = action.payload;
      const existingItem = state.guestCartItems.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.guestCartItems.push({
          productId,
          quantity,
          product, // Store product details for display
        });
      }
      // Save to localStorage
      saveGuestCartToStorage(state.guestCartItems);
    },
    removeFromGuestCart: (state, action) => {
      const { productId } = action.payload;
      state.guestCartItems = state.guestCartItems.filter(
        (item) => item.productId !== productId
      );
      // Save to localStorage
      saveGuestCartToStorage(state.guestCartItems);
    },
    updateGuestCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.guestCartItems.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        if (quantity <= 0) {
          state.guestCartItems = state.guestCartItems.filter(
            (item) => item.productId !== productId
          );
        } else {
          existingItem.quantity = quantity;
        }
      }
      // Save to localStorage
      saveGuestCartToStorage(state.guestCartItems);
    },
    clearGuestCart: (state) => {
      state.guestCartItems = [];
      state.guestCartId = null;
      // Clear from localStorage
      localStorage.removeItem('guestCart');
    },
    setGuestCartId: (state, action) => {
      state.guestCartId = action.payload;
    },
  },
});

export const {
  addToGuestCart,
  removeFromGuestCart,
  updateGuestCartQuantity,
  clearGuestCart,
  setGuestCartId,
} = guestCartSlice.actions;

export default guestCartSlice.reducer;
