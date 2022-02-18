import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";

import {
  Box,
  Button,
} from '@material-ui/core';


const CommonToolbar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const shopId = useSelector(state => state.admin.shopId);

  const addProductHandle = () => {
    navigate('/host/admin/product/add', {replace: true});
  };

  const contentLink = `http://localhost:3000/host/shop/${shopId}`;

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
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
      <Button sx={{ mx: 1 }} onClick={shareLinkHandle}>
        Share Shop
      </Button>
      {location.pathname === '/host/admin/product' && (
        <Button
          color="primary"
          variant="contained"
          onClick={addProductHandle}
        >
          Add product
        </Button>
      )}
    </Box>
  </Box>
  )
};

export default React.memo(CommonToolbar);
