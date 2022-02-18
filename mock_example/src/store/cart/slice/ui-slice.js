import { createSlice } from '@reduxjs/toolkit';

const uiCartSlice = createSlice({
  name: 'cartUi',
  initialState: {
    isShowCart: false,
  },
  reducers: {
    toggleCart(state) {
      state.isShowCart = !state.isShowCart;
    }
  }
})

export const uiCartAction = uiCartSlice.actions;
export default uiCartSlice;
