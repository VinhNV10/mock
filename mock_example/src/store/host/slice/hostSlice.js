import { createSlice } from '@reduxjs/toolkit';

const hostSlice = createSlice({
  name: 'hostSlice',
  initialState: {
    isLogin: false,
    customerId: '',
    shopId: '',
    cartId: '',
    listProduct: [],
    shopName: '',
  },
  reducers: {
    onLogin(state, action) {
      state.isLogin = true;
      state.customerId = action.payload.customerId;
      state.shopId = action.payload.shopId;
    },
    setInformationShop(state, action) {
      state.shopId = action.payload.shopId;
      state.shopName = action.payload.shopName;
      state.listProduct = action.payload.products;
      state.cartId = action.payload.cartId;
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

export const { onLogin, setInformationShop, onLogout } = hostSlice.actions;
export default hostSlice;
