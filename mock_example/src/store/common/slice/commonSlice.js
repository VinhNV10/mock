import { createSlice } from '@reduxjs/toolkit';

const uiCommonSlice = createSlice({
  name: 'uiCommon',
  initialState: {
    isLoading: false,
    errorMessage: '',
    type: '',
  },
  reducers: {
    updateUiCommon(state, action) {
      state.isLoading = action.payload.loading;
      state.errorMessage = action.payload.error;
      state.type = action.payload.type;
    },
  }
})

export const { updateUiCommon } = uiCommonSlice.actions;
export default uiCommonSlice;
