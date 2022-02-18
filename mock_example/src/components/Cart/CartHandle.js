import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import UseAxios from 'hook/useAxios';
import { uiCartAction } from 'store/cart/slice/ui-slice';
import { updateUiCommon } from 'store/common/slice/commonSlice';
import { resetCart } from "store/cart/slice/cart-slice";

import { Button } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';

import "./CartHandle.scss";

const CartHandle = (props) => {

  const navigate = useNavigate();
  const dispatch =  useDispatch();
  const { sendRequest } = UseAxios();

  const totalPrice = useSelector(state => state.cart.totalPrice);
  const personCart = useSelector(state => state.cart.personCart);
  const listGuest = useSelector(state => state.cart.listGuest);
  const auth = useSelector(state => state.cart.auth);

  const cartId = useSelector(state => {
    if (auth === 'HOST') {
      return state.host.cartId;
    } else {
      return state.guest.cartId
    }
  });

  const customerId = useSelector(state => {
    if (auth === 'HOST') {
      return state.host.customerId;
    } else {
      return state.guest.customerId
    }
  });

  const createOrder = () => {
    sendRequest({
      method: 'POST',
      url: '/Order',
      data: {
        cartId,
        deliveryInformation: 'Confirmed'
      }
    }).then((response) => {
      if (response.isSuccess) {
        dispatch(updateUiCommon({ loading: false, error: '' }));
        navigate(`/host/tracking/${response.orderId}`, { replace: true });
      } else {
        dispatch(updateUiCommon({ loading: false, error: response.errorMessage}));
      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: 'Some thing is wrong' }));
    });
  }

  const submitCart = () => {
    const data = {};
    const items = [];

    for (const key in personCart) {
      items.push({
        itemId: personCart[key].itemId,
        amount: personCart[key].amount,
        isDeleted: false,
      });
    }

    data.customerId = customerId;
    data.cartId = cartId;
    data.items = items;

    sendRequest({
      method: 'POST',
      url: '/Cart/submit',
      data,
    }).then((response) => {
      if (response.isSuccess) {
        dispatch(uiCartAction.toggleCart());
        dispatch(resetCart());
        if (auth === 'HOST') {
          createOrder();
        }
      } else {
        dispatch(updateUiCommon({ loading: false, error: response.errorMessage}));
      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: 'Some thing is wrong' }));
    });
  }

  const checkOutCartHandle = () => {
    if (listGuest && listGuest.length >= 0 && auth === 'HOST') {
      const statusSubmitEvery = listGuest.every(item => item.statusSubmit);
      if (!statusSubmitEvery) {
        dispatch(updateUiCommon({ loading: false, error: 'Please say Guest CheckOut cart'}));
        return;
      }
    }

    if (personCart.length === 0 ) {
      dispatch(uiCartAction.toggleCart());
      dispatch(updateUiCommon({ loading: false, error: 'Please add product to cart'}));
      return;
    } else {
      submitCart();
    }
  };

  const buyMoreHandle = () => {
    dispatch(uiCartAction.toggleCart());
  }

  return (
    <div className="cart-handle">
      <div className="cart-handle__total">
        <span className="cart-handle__txt">Total</span>
        <span className="cart-handle__price">${totalPrice}</span>
      </div>

      <div className="cart-handle__btns">
        <Button className="cart-handle__btn" onClick={checkOutCartHandle}>
          <ShoppingCartIcon />
          <span>Checkout</span>
        </Button>
        <Button className="cart-handle__btn cart-handle__btn--buyMore" onClick={buyMoreHandle}>
          <StoreMallDirectoryIcon />
          <span>Buy more</span>
        </Button>
      </div>
    </div>
  )
};

export default CartHandle;
