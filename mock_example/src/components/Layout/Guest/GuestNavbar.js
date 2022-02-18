import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Cart from 'components/Cart';
import { uiCartAction } from 'store/cart/slice/ui-slice';
import { onLogout } from 'store/guest/slice/guestSlice';

import {
  AppBar,
  Badge,
  IconButton,
} from '@material-ui/core';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HomeIcon from '@material-ui/icons/Home';
import InputIcon from '@material-ui/icons/Input';

import './GuestNavbar.scss';

const GuestNavbar = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const totalAmount = useSelector(state => state.cart.totalAmount);
  const shopName = useSelector(state => state.guest.shopName);

  const toogleCartHandle = () => {
    dispatch(uiCartAction.toggleCart());
  };

  const logOutHandle = () => {
    sessionStorage.removeItem('guestId');
    dispatch(onLogout());
    navigate(`${location.pathname.replace('/login', '')}`, {replace: false});
  }

  return (
    <React.Fragment>
      <AppBar
        elevation={0}
      >
        <div className="guest-nav">
          <div className="guest-nav__shopName">
            <h2>{shopName}</h2>
          </div>
          <div className="guest-nav__left">
            <ul className="guest-nav__list">
              <li className="guest-nav__item">
                <HomeIcon />
                Page
              </li>
            </ul>
          </div>
          <div className="guest-nav__right">
            <div className="guest-nav__cart">
              <IconButton color="inherit" size="large" onClick={toogleCartHandle}>
                <Badge color="secondary" badgeContent={totalAmount}>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" size="large" onClick={logOutHandle}>
                <InputIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </AppBar>
      <Cart />
    </React.Fragment>
  );
};

export default GuestNavbar;
