import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cart/slice/cart-slice';
import uiCartSlice from './cart/slice/ui-slice';
import adminSlice from './admin/slice/adminSlice';
import uiCommonSlice from './common/slice/commonSlice';
import hostSlice from './host/slice/hostSlice';
import guestSlice from './guest/slice/guestSlice';

const store = configureStore({
  reducer: {
    uiCart: uiCartSlice.reducer,
    cart: cartSlice.reducer,
    admin: adminSlice.reducer,
    uiCommon: uiCommonSlice.reducer,
    host: hostSlice.reducer,
    guest: guestSlice.reducer,
  },
});

export default store;
