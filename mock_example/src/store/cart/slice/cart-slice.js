import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    personCart: [],
    otherPersonCart: [],
    listGuest: [],
    totalAmount: 0,
    totalPrice: 0,
    auth: '',
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.personCart.find(item => item.itemId === newItem.itemId);
      state.totalPrice = state.totalPrice + newItem.price;
      state.totalAmount++;
      if (!existingItem) {
        state.personCart.push({
          itemId: newItem.itemId,
          itemName: newItem.name,
          price: newItem.price,
          amount: 1,
          image: newItem.image,
          customerId: newItem.customerId,
        });
      } else {
        existingItem.amount++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },

    deleteItemToCart(state, action) {
      const itemId = action.payload.itemId;
      const amount = action.payload.amount;
      const subTotalPrice = action.payload.subTotalPrice;
      state.totalAmount = state.totalAmount - amount;
      state.totalPrice = state.totalPrice - subTotalPrice;
      state.personCart = state.personCart.filter((item) => item.itemId !== itemId);
    },

    setCart(state, action) {
      state.personCart = action.payload.personCart;
      state.otherPersonCart = action.payload.otherPersonCart;
      state.listGuest = action.payload.listGuest;
      state.totalAmount = action.payload.totalAmount;
      state.totalPrice = action.payload.totalPrice;
      state.auth = action.payload.auth;
    },

    resetCart(state, action) {
      state.personCart = [];
      state.otherPersonCart = [];
      state.listGuest = [];
      state.totalAmount = 0;
      state.totalPrice = 0;
    }
  }
});

export const cartAction = cartSlice.actions;
export const { setCart, addItemToCart, deleteItemToCart, resetCart } = cartSlice.actions;

export default cartSlice;
