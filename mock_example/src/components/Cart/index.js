import { useSelector, useDispatch } from 'react-redux';

import CartList from './CartList';
import CartHandle from './CartHandle';
import { uiCartAction } from 'store/cart/slice/ui-slice';

import CancelIcon from '@material-ui/icons/Cancel';

import './styles.scss';

const Cart = () => {
  
  const isShowCart = useSelector(state => state.uiCart.isShowCart);
  const dispatch =  useDispatch();

  const closeCartHandler = () => {
    dispatch(uiCartAction.toggleCart());
  };

  return (
    <div className={isShowCart ? "cart active" : 'cart'}>
      <div className="cart__overlay" onClick={closeCartHandler}></div>
      <div className="cart__container">
        <div className="cart__heading">
          <h2 className="cart__title">Shopping Cart</h2>
          <div className="cart__close" onClick={closeCartHandler}>
            <CancelIcon />
          </div>
        </div>
        <CartList />
        <CartHandle />
      </div>
    </div>
  )
};

export default Cart;