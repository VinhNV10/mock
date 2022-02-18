import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Container, Box } from "@material-ui/core";
import { styled } from '@material-ui/core/styles';

import Empty from 'components/Empty';
import ProductList from 'components/Product/ProductList';
import CommonToolbar from 'components/CommonToolbar';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import ErrorModal from 'components/Layout/ErrorModal';
import OrderEmpty from "assets/svgs/Shop/empty-shop.svg";
import { updateUiCommon } from 'store/common/slice/commonSlice';

const ContainerRoot = styled(Container)({
  height: '100%',
  padding: '0 10px',
});

const Product = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLogin = useSelector(state => state.admin.isLogin);
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const errorMessage = useSelector(state => state.uiCommon.errorMessage);
  const type = useSelector(state => state.uiCommon.type);

  useEffect(() => {
    if (!isLogin) {
      navigate('/host/admin/login', {replace: true});
    }
  }, [isLogin, navigate])

  const productList = useSelector(state => state.admin.informationAdmin.items);

  const closeModalHandle = () => {
    dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
  };

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
        <ContainerRoot maxWidth={false}>
          <CommonToolbar />
          { productList && productList.length === 0 && (
            <Empty
              title="There is no product you are looking for 🕵️"
              img={OrderEmpty}
              altImg="Order Empty"
            />
          )}
          { isLoading && type === 'DELETE' && <LoadingSpinner /> }
          { productList && productList.length >= 0 && <ProductList productList={productList} /> }
        </ContainerRoot> 
      </Box>
    </React.Fragment>
  )
};

export default Product;
