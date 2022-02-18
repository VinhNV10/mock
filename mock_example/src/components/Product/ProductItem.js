import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { toast } from 'react-toastify';

import UseAxios from 'hook/useAxios';
import { removeItemProduct } from 'store/admin/slice/adminSlice';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { updateUiCommon } from 'store/common/slice/commonSlice';

import 'react-lazy-load-image-component/src/effects/blur.css';
import './ProductItem.scss';

ProductItem.propTypes = {
  img: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number
};

ProductItem.defaultProps = {
  img: '',
  name: '',
  price: 0
};

function ProductItem(props) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {sendRequest } = UseAxios();

  const { itemId, name, price, image } = props;
  const shopId = useSelector(state => state.admin.shopId);

  const removeItemToCart = (itemId) => {
    dispatch(updateUiCommon({ loading: true, error: '', type: 'DELETE' }));
    sendRequest({
      method: 'DELETE',
      url: '/Item',
      headers: {'Content-Type': 'application/json'},
      data: {
        shopId,
        itemId
      }
    }).then((response) => {
      dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
      dispatch(removeItemProduct(itemId));
      toast('Remove product is successfully!', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }).catch((error) => {
      dispatch(updateUiCommon({loading: false, error, type: '' }));
    });
  };

  const editItemToCart = (itemId) => {
    navigate(`/host/admin/product/${itemId}`);
  };

  return (
    <div className="productItem">
      <div className="productItem__img">
        <LazyLoadImage
          effect='blur'
          src={`data:image/jpeg;base64,${image}`}
          className="productItem__img"
          alt={name}
          width='100%'
          height='100%'
        />
      </div>
      <div className="productItem__content">
        <div className="productItem__name">{name}</div>
        <div className="productItem__price">${price.toFixed(2)}</div>
      </div>
      <div className="productItem__action">
        <div className="productItem__addshop" onClick={editItemToCart.bind(null, itemId)}>
          <EditIcon />
        </div>
        <div className="productItem__addshop" onClick={removeItemToCart.bind(null, itemId)}>
          <DeleteIcon />
        </div>
      </div>
    </div>
  )
};

export default ProductItem;