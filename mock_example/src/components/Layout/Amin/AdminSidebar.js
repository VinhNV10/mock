import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Drawer,
  Hidden,
  Box,
  List,
  Typography,
  Avatar,
  Divider
} from '@material-ui/core';
import {
  ShoppingBag as ShoppingBagIcon,
  ShoppingCart as ShoppingCartIcon
} from 'react-feather';

import NavItem from '../NavItem';
import { onLogout } from 'store/admin/slice/adminSlice';

AdminSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

AdminSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

const items = [
  {
    href: '/host/admin/product',
    icon: ShoppingBagIcon,
    title: 'Product'
  },
  {
    href: '/host/admin/order',
    icon: ShoppingCartIcon,
    title: 'Order'
  },
];

function AdminSidebar (props) {

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { onMobileClose, openMobile } = props;
  const name = useSelector(state => state.admin.informationAdmin.name);
  const image = useSelector(state => state.admin.informationAdmin.image);
  const phoneNumber = useSelector(state => state.admin.informationAdmin.phoneNumber);

  useEffect(() => {
    onMobileClose();
  }, [onMobileClose, location.pathname]);

  const logOutHandle = useCallback(() => {
    sessionStorage.removeItem('shopId');
    dispatch(onLogout());
    navigate('/host/admin/login', {replace: false});
  },[dispatch, navigate]);

  const content = (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            p: 2
          }}
        >
          <Avatar
            component={RouterLink}
            src={image ? `data:image/jpeg;base64,${image}` : null}
            sx={{
              cursor: 'pointer',
              width: 64,
              height: 64
            }}
            to="/host/admin/profile"
          />
          <Typography
            color="textPrimary"
            variant="h5"
          >
            {name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {phoneNumber}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
            sx={{
              cursor: 'pointer',
            }}
            onClick={logOutHandle}
          >
            LogOut
          </Typography>
        </Box>

        <Divider />
        <Box sx={{ p: 2 }}>
          <List>
            {items.map((item) => (
              <NavItem
                href={item.href}
                key={item.title}
                title={item.title}
                icon={item.icon}
              />
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  )

  return (
    <React.Fragment>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256,
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </React.Fragment>
  );
};

export default React.memo(AdminSidebar);
