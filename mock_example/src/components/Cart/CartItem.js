import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from "@material-ui/core";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { toast } from 'react-toastify';

import { updateUiCommon } from 'store/common/slice/commonSlice';
import UseAxios from 'hook/useAxios';

import './CartItem.scss';
import { deleteItemToCart } from 'store/cart/slice/cart-slice';

CartItem.propTypes = {
  itemId: PropTypes.string,
  itemName: PropTypes.string,
  price: PropTypes.number,
  amount: PropTypes.number,
}

CartItem.defaultProps =  {
  itemId: '',
  itemName: '',
  price: 0,
  amount: 0,
};

function CartItem (props) {

  const { itemId, itemName, price, amount, customerId } = props;
  let { image } = props;
  const auth = useSelector(state => state.cart.auth);

  const cartId = useSelector(state => {
    if (auth === 'HOST') {
      return state.host.cartId;
    } else {
      return state.guest.cartId
    }
  });

  const customerPerson = useSelector(state => {
    if (auth === 'HOST') {
      return state.host.customerId;
    } else {
      return state.guest.customerId
    }
  });

  const listProduct = useSelector(state => {
    if (auth === 'HOST') {
      return state.host.listProduct;
    } else {
      return state.guest.listProduct;
    }
  });

  for (const key in listProduct) {
    if (listProduct[key].itemId === itemId) {
      image = listProduct[key].image;
    }
  }

  const dispatch = useDispatch();
  const { sendRequest } = UseAxios();

  const deleteItemToCartHandle = () => {
    dispatch(updateUiCommon({ loading: true, error: '' }));
    sendRequest({
      method: 'POST',
      url: '/Cart/remove/item',
      data: {
        itemId,
        customerId: customerPerson,
        cartId
      }
    }).then((response) => {
      if (response.isSuccess) {
        dispatch(updateUiCommon({ loading: false, error: '' }));
        dispatch(deleteItemToCart({
          itemId,
          amount,
          subTotalPrice: price * amount,
        }));
        toast('The product has been remove to cart', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        dispatch(updateUiCommon({ loading: false, error: response.errorMessage}));
      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: 'Some thing is wrong' }));
    });
    
  };

  return (
    <div className="cart-item">

      <div className="cart-item__img">
        <LazyLoadImage
          effect='blur'
          src={`data:image/jpeg;base64,${image}`}
          className="productItem__img"
          alt={itemName}
          width='100%'
          height='100%'
        />
      </div>

      <div className="cart-item__content">
        <div className="cart-item__name">{itemName}</div>
        <div className="cart-item__price">${price * amount}</div>
        <div className="cart-item__handle">
          <span className="cart-item__qnt">{amount}</span>
        </div>
      </div>

      { customerId === customerPerson && (
        <Button className="cart-item__rm" onClick={deleteItemToCartHandle}>
          <DeleteOutlineIcon />
        </Button>
      )}
    </div>
  )
};

export default CartItem;
