import { updateUiCommon } from 'store/common/slice/commonSlice';
import { getAdmin } from '../slice/adminSlice';
import { onLogin } from 'store/admin/slice/adminSlice';

export const getSessionLogin = (shopId) => {

  return (dispatch) => {
    const shopId = sessionStorage.getItem('shopId');
    if (shopId) {
      dispatch(onLogin(shopId));
    }
  }
}

export const fetchAdmin = (shopId, sendRequest) => {
  return (dispatch) => {

    dispatch(updateUiCommon({loading: true, error: '', type: '' }));

    sendRequest({
      method: 'GET',
      url: `/Shop/${shopId}`,
    }).then((response) => {
      dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
      dispatch(getAdmin(response));
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: error.response?.data ?? 'Some thing is wrong', type: '' }));
    });
  }
};






