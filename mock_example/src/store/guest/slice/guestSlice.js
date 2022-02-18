import { createSlice } from '@reduxjs/toolkit';

const guestSlice = createSlice({
  name: 'guestSlice',
  initialState: {
    isLogin: false,
    customerId: '',
    shopId: '',
    shopName: '',
    cartId: '',
    listProduct: [],
  },
  reducers: {
    onLogin(state, action) {
      state.isLogin = true;
      state.cartId = action.payload.cartId;
      state.customerId = action.payload.customerId;
    },
    setInformationShop(state, action) {
      state.shopId = action.payload.shopId;
      state.shopName = action.payload.shopName;
      state.listProduct = action.payload.products;
    },
    onLogout(state, action) {
      state.isLogin = false;
      state.customerId = '';
      state.cartId = '';
      state.shopName = ''
      state.listProduct = '';
      state.shopId = '';
    },
  }
})

export const { onLogin, setInformationShop, onLogout } = guestSlice.actions;
export default guestSlice;
