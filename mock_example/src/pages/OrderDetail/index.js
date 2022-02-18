import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import OrderEditForm from 'components/OrderDetail/OrderEditForm';
import UseAxios from 'hook/useAxios';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import CommonToolbar from 'components/CommonToolbar';
import ErrorModal from 'components/Layout/ErrorModal';
import { updateUiCommon } from 'store/common/slice/commonSlice';

import Box from "@material-ui/core/Box";
import { styled } from "@material-ui/core/styles";

const StyledSpanBox = styled(Box)({
  maxWidth: 700,
  marginLeft: '20px'
});

const OrderDetail = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {sendRequest } = UseAxios();

  const [orderDetail, setOrderDetail] =  useState();

  const { id } = useParams();
  const isLogin = useSelector(state => state.admin.isLogin);
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const errorMessage = useSelector(state => state.uiCommon.errorMessage);
  const type = useSelector(state => state.uiCommon.type);

  const closeModalHandle = () => {
    dispatch(updateUiCommon({loading: false, error: ''}));
  };

  const fetchOrderDetail = useCallback(() => {
    dispatch(updateUiCommon({ loading: true, error: '', type: '' }));
    sendRequest({
      method: 'GET',
      url: `/Order/${id}`,
    }).then((response) => {
      setOrderDetail(response);
      dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: 'Some thing is wrong', type: '' }));
    });
  }, [dispatch, id, sendRequest]);

  useEffect(() => {
    if (!isLogin) {
      navigate('/host/admin/login', {replace: true});
    } else {
      fetchOrderDetail();
    }
  }, [fetchOrderDetail, isLogin, navigate])

  if (isLoading && !type) {
    return (<LoadingSpinner />);
  }

  const changeStatusOrder = (valueStatus) => {
    setOrderDetail((prevState) => {
      return {...prevState, status:valueStatus}
    })
  };

  return (
    <React.Fragment>
      <ErrorModal isModal={errorMessage ?  true : false} onClose={closeModalHandle}>{errorMessage}</ErrorModal>
      { orderDetail && orderDetail.customerId && (
        <StyledSpanBox
          sx={{
            minHeight: '100%',
            py: 3,
          }}
        >
          <CommonToolbar />
          <OrderEditForm
            orderDetail={orderDetail} orderId={id} onChangeStatusOrder={changeStatusOrder} />
        </StyledSpanBox>
      )}
    </React.Fragment>
  )
}

export default OrderDetail;
