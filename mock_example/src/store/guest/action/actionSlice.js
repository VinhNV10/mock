import { setCart } from 'store/cart/slice/cart-slice';
import { updateUiCommon } from 'store/common/slice/commonSlice';
import { setInformationShop } from '../slice/guestSlice';

export const fetchGuest = (navigate, sendRequest, cartId, customerId) => {

  return async (dispatch) => {
    dispatch(updateUiCommon({loading: true, error: '', type: '' }));
    sendRequest({
      method: 'GET',
      url: `/Cart/${cartId}`,
      params: {
        getShop: true,
      }
    }).then((response) => {

      const products = response.shop.items.filter(item => item.isActive);
      const personCart = response.itemsInCart.filter(item => item.customerId === customerId && !item.isDeleted && !item.readyToOrder);

      let totalAmount = 0;
      let totalPrice = 0;
      for (const key in personCart) {
        totalAmount = totalAmount + personCart[key].amount;
        totalPrice = totalPrice + personCart[key].price;
      }

      dispatch(setInformationShop({shopId: response.shop.shopId, shopName: response.shop.name, products }));
      dispatch(setCart({personCart, otherPersonCart: [], listGuest: [], totalAmount, totalPrice, auth: 'GUEST'}));

      dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
      navigate('/404');
    });
  }
};
