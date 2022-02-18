import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Cart from 'components/Cart';
import { uiCartAction } from 'store/cart/slice/ui-slice';
import { onLogout } from 'store/host/slice/hostSlice';

import {
  AppBar,
  Badge,
  IconButton,
  Box
} from '@material-ui/core';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ShareIcon from '@material-ui/icons/Share';
import HomeIcon from '@material-ui/icons/Home';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InputIcon from '@material-ui/icons/Input';

import { toast } from 'react-toastify';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";

import './HostNavbar.scss';

const HostNavbar = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const totalAmount = useSelector(state => state.cart.totalAmount);
  const shopName = useSelector(state => state.host.shopName);
  const cartId = useSelector(state => state.host.cartId);

  const toogleCartHandle = () => {
    dispatch(uiCartAction.toggleCart());
  };

  const logOutHandle = () => {
    sessionStorage.removeItem('hostId');
    dispatch(onLogout());
    navigate(`${location.pathname.replace('/login', '')}`, {replace: false});
  }

  const contentLink = `http://localhost:3000/host/cart/${cartId}`;

  const customToastWithLink = ({ closeToast }) => (
    <CopyToClipboard
      onCopy={() => {
        closeToast();
      }}
      render={({ copy }) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p>{contentLink}</p>
          <FileCopyIcon
            sx={{
              marginLeft: '5px',
            }}
            onClick={() => copy(contentLink)}
          />
        </Box>
      )}
    />
  );


  const shareLinkHandle = () => {
    toast.dark(customToastWithLink, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
    });
  }

  return (
    <React.Fragment>
      <AppBar
        elevation={0}
      >
        <div className="host-nav">
          <div className="host-nav__shopName">
            <h2>{shopName}</h2>
          </div>
          <div className="host-nav__left">
            <ul className="host-nav__list">
              <li className="host-nav__item">
                <HomeIcon />
                Page
              </li>
              <li className="host-nav__item" onClick={shareLinkHandle}>
                <ShareIcon />
                Share
              </li>
            </ul>
          </div>
          <div className="host-nav__right">
            <div className="host-nav__cart">
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

export default HostNavbar;