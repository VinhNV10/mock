import { setCart } from 'store/cart/slice/cart-slice';
import { updateUiCommon } from 'store/common/slice/commonSlice';
import { setInformationShop } from '../slice/hostSlice';
import { LogLevel, HubConnectionBuilder } from '@microsoft/signalr';

export const fetchHost = (navigate, sendRequest, shopId, customerId) => {

  const startCons = async function(dispatch, cartId) {
    const connection = new HubConnectionBuilder()
    .withUrl(`http://localhost:8080/hubs/cart?cart=${cartId}`, {
      withCredentials: false
    })
    .configureLogging(LogLevel.Information)
    .build();

    try {
      await connection.start();
    } catch(e) {
      console.log(e);
    }

    connection.on('AddItemToCart', (message) => {getCart(dispatch, cartId)});
    connection.on('RemoveItemFromCart', (message) => {getCart(dispatch, cartId)});
    connection.on('SubmitItems', (message) => {getCart(dispatch, cartId)});
  };

  const getCart = (dispatch, cartId) => {
    dispatch(updateUiCommon({ loading: true, error: '', type: '' }));
    sendRequest({
      method: 'GET',
      url: `/Cart/${cartId}`,
      params: {
        getShop: true,
      }
    }).then((response) => {
      const products = response.shop.items.filter(item => item.isActive);

      const personCart = response.itemsInCart.filter(item => item.customerId === customerId && !item.isDeleted);
      const otherPersonCart = response.itemsInCart.filter(item => item.customerId !== customerId && !item.isDeleted);

      const listGuestTemporary =  otherPersonCart.map(item => ({guestId: item.customerId, guestName: item.customerName}));

      const checkStatusSubmitOther = (customerId) => {
        const listCart = otherPersonCart.filter(item => item.customerId === customerId);
        return listCart.every(item => item.readyToOrder)
      };

      const listGuest = listGuestTemporary.reduce((unique, o) => {
        if(!unique.some(obj => obj.guestId === o.guestId)) {
          unique.push(o);
        }
        return unique;
      },[]);

      for (const key in listGuest) {
        listGuest[key].statusSubmit = checkStatusSubmitOther(listGuest[key].guestId);
      }

      let totalAmount = 0;
      const totalPrice = response.totalPrice;

      for (const key in personCart) {
        totalAmount = totalAmount + personCart[key].amount;
      }

      for (const key in otherPersonCart) {
        totalAmount = totalAmount + otherPersonCart[key].amount;
      }

      dispatch(setInformationShop({shopId: response.shop.shopId, shopName: response.shop.name, products, cartId }));
      dispatch(setCart({personCart, otherPersonCart, listGuest, totalAmount, totalPrice, auth: 'HOST'}));

      dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
      navigate('/404');
    });
  } 

  return (dispatch) => {
    dispatch(updateUiCommon({loading: true, error: '', type: '' }));
      sendRequest({
        method: 'POST',
        url: '/Cart/create',
        data: {
          shopId,
          customerId
        }
      }).then((response) => {
        startCons(dispatch, response.cartId);
        getCart(dispatch, response.cartId);
      }).catch((error) => {
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
        navigate('/404');
      });
  }
};
