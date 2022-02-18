import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Container, Box } from "@material-ui/core";

import OrderList from 'components/Order/OrderList';
import OrderEmpty from "assets/svgs/Shop/empty-shop.svg";
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import CommonToolbar from 'components/CommonToolbar';
import Empty from 'components/Empty';
import UseAxios from 'hook/useAxios';
import ErrorModal from 'components/Layout/ErrorModal';
import { updateUiCommon } from 'store/common/slice/commonSlice';

import { LogLevel, HubConnectionBuilder } from '@microsoft/signalr';

  const columns = [
    { id: 'orderId', label: 'Order Id', minWidth: 100 },
    { id: 'customerName', label: 'Customer Name', minWidth: 200 },
    { id: 'customerPhoneNumber', label: 'PhoneNumber', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 200 },
    { id: 'totalPrice', label: 'Total Price', minWidth: 100 },
    { id: 'action', label: '', minWidth: 100 },
  ];

const Order = () => {  

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {sendRequest } = UseAxios();

  const shopId = useSelector(state => state.admin.shopId);
  const isLogin = useSelector(state => state.admin.isLogin);
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const errorMessage = useSelector(state => state.uiCommon.errorMessage);
  const type = useSelector(state => state.admin.type);

  const [orders, setOrders] =  useState();

  const closeModalHandle = () => {
    dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
  };

  const fetchListOrder = useCallback(() => {
    dispatch(updateUiCommon({ loading: true, error: '', type: '' }));
    sendRequest({
      method: 'GET',
      url: `/Order/${shopId}/shop/all`,
    }).then((response) => {
      if (!response.errorMessage) {
        setOrders(response.orders);
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
      } else {
        dispatch(updateUiCommon({ loading: false, error: response.errorMessage, type: '' }));
      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: 'Some thing is wrong', type: '' }));
    });
  }, [dispatch, sendRequest, shopId]);

  const startCons = useCallback(async function() {

    const connection = new HubConnectionBuilder()
    .withUrl(`http://localhost:8080/hubs/shop?shop=${shopId}`, {
      withCredentials: false
    })
    .configureLogging(LogLevel.Information)
    .build();

    try {
      await connection.start();
    } catch(e) {
      console.log(e);
    }

    connection.on('NewOrder', (message) => {fetchListOrder()});
  }, [fetchListOrder, shopId]);

  useEffect(() => {
    if (!isLogin) {
      navigate('/host/admin/login', {replace: true});
    } else {
      startCons();
      fetchListOrder();
    }
  }, [fetchListOrder, isLogin, navigate, startCons])

  if (isLoading && !type) {
    return (<LoadingSpinner />);
  }

  return (
    <React.Fragment>
      <ErrorModal isModal={errorMessage ?  true : false} onClose={closeModalHandle}>{errorMessage}</ErrorModal>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            height: '100%',
            py: 3
          }}
        >
          <Container maxWidth={false} sx={{ height: '100%' }}>
            <CommonToolbar />
            { orders && orders.length === 0 ? (
              <Empty
                title="There is no Order you are looking for 🕵️"
                img={OrderEmpty}
                altImg="Order Empty"
              />
              ) : (
              <OrderList columns={columns} rows={orders} />
            )}
          </Container> 
        </Box>
    </React.Fragment>
  )
};

export default Order;
