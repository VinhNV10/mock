import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Container, Box } from "@material-ui/core";
import { styled } from '@material-ui/core/styles';

import ProductEmpty from "assets/svgs/Shop/empty-shop.svg";
import Empty from 'components/Empty';
import ShopList from 'components/Shop/ShopList';
import ErrorModal from 'components/Layout/ErrorModal';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import { updateUiCommon } from 'store/common/slice/commonSlice';

const ContainerRoot = styled(Container)({
  height: '100%',
  padding: '0 10px',
});

const ShopGuest = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isLogin = useSelector(state => state.guest.isLogin);
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const errorMessage = useSelector(state => state.uiCommon.errorMessage);
  const type = useSelector(state => state.uiCommon.type);
  const listProduct = useSelector(state => state.guest.listProduct);

  useEffect(() => {
    if (!isLogin) {
      navigate(`${location.pathname}/login`, {replace: false});
    }
  }, [dispatch, isLogin, location.pathname, navigate]);

  if (isLoading && !type) {
    return (<LoadingSpinner />);
  }

  const closeModalHandle = () => {
    dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
  };

  return (
    <React.Fragment>
      <ErrorModal isModal={errorMessage ?  true : false} onClose={closeModalHandle}>{errorMessage}</ErrorModal>
      <Box
        sx={{
          minHeight: '100%',
          height: '100%',
          py: 1
        }}
      >
        <ContainerRoot maxWidth={false}>
          { listProduct && listProduct.length === 0 && (
            <Empty
              title="There is no Order you are looking for 🕵️"
              img={ProductEmpty}
              altImg="Order Empty"
            />
          )}
          { listProduct && listProduct.length >= 0 && <ShopList shopList={listProduct} /> }
        </ContainerRoot> 
      </Box>
    </React.Fragment>
  )
};

export default ShopGuest;
