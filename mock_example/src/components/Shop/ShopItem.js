import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import UseAxios from 'hook/useAxios';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import { addItemToCart } from 'store/cart/slice/cart-slice';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { updateUiCommon } from 'store/common/slice/commonSlice';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { toast } from 'react-toastify';

import './ShopItem.scss';

ShopItem.propTypes = {
  itemId: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  image: PropTypes.string,
};

ShopItem.defaultProps = {
  img: '',
  name: '',
  price: '',
  image: ''
};

function ShopItem(props) {

  const { sendRequest } = UseAxios();
  const dispatch = useDispatch();
  const location = useLocation();
  const { itemId, name, price, image } = props;
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const type = useSelector(state => state.uiCommon.type);

  const cartId = useSelector(state => {
    if (location.pathname.includes('host/shop')) {
      return state.host.cartId;
    } else {
      return state.guest.cartId
    }
  });

  const customerId = useSelector(state => {
    if (location.pathname.includes('host/shop')) {
      return state.host.customerId;
    } else {
      return state.guest.customerId
    }
  });

  const addItemToCartHandle = () => {
    dispatch(updateUiCommon({ loading: true, error: '', type: 'ADD' }));
    sendRequest({
      method: 'POST',
      url: '/Cart/add/item',
      data: {
        cartId,
        customerId,
        itemId
      }
    }).then((response) => {
      if (response.isSuccess) {
        dispatch(addItemToCart({
          itemId,
          name,
          price,
          image,
          customerId
        }));
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
        toast('The product has been added to cart', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        dispatch(updateUiCommon({ loading: false, error: response.errorMessage, type: '' }));
      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: error.response?.data ?? 'Some thing is wrong', type: '' }));
    });
  };

  return (
    <div className="shopItem">
      <div className="shopItem__img">
        <LazyLoadImage
          effect='blur'
          src={`data:image/jpeg;base64,${image}`}
          className="productItem__img"
          alt={name}
          width='100%'
          height='100%'
        />
      </div>
      <div className="shopItem__content">
        <div className="shopItem__name">{name}</div>
        <div className="shopItem__price">${price.toFixed(2)}</div>
      </div>
      <div className="shopItem__action">
        <div className="shopItem__addshop" onClick={addItemToCartHandle}>
          <ShoppingCartIcon />
        </div>
        { isLoading && type === 'ADD' && <LoadingSpinner /> }
      </div>
    </div>
  )
};

export default ShopItem;