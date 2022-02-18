import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'cartUi',
  initialState: {
    isLogin: false,
    shopId: '',
    informationAdmin: {},
  },
  reducers: {
    onLogin(state, action) {
      state.isLogin = true;
      state.shopId = action.payload;
    },
    onLogout(state, action) {
      state.isLogin = false;
      state.shopId = '';
    },
    getAdmin(state, action) {
      state.informationAdmin = action.payload;
      state.informationAdmin.items = state.informationAdmin.items.filter(item => item.isActive);
    },
    addItemProduct(state, action) {
      state.informationAdmin.items.push({
        itemId: action.payload.itemId,
        name: action.payload.name,
        price: action.payload.price,
        isActive: action.payload.isActive,
        shopId: action.payload.shopId,
        image: action.payload.image,
      });
    },
    editItemProduct(state, action) {
      const objIndex = state.informationAdmin.items.findIndex((item =>item.itemId === action.payload.itemId));
      state.informationAdmin.items[objIndex].name = action.payload.name;
      state.informationAdmin.items[objIndex].price = action.payload.price;
      state.informationAdmin.items[objIndex].image = action.payload.image;
    },
    removeItemProduct(state, action) {
      const itemId = action.payload;
      state.informationAdmin.items = state.informationAdmin.items.filter((item) => item.itemId !== itemId);
    },
    editProfile(state, action) {
      state.informationAdmin.name = action.payload.shopName;
      state.informationAdmin.phoneNumber = action.payload.phoneNumber;
    },
  }
})

export const {
  onLogin,
  onLogout,
  getAdmin,
  removeItemProduct,
  addItemProduct,
  editItemProduct,
  editProfile,
} = adminSlice.actions;
export default adminSlice;
