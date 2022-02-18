import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import ProductDetailForm from 'components/ProductDetail/ProductDetailForm';
import ErrorModal from 'components/Layout/ErrorModal';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import CommonToolbar from 'components/CommonToolbar';

import Box from "@material-ui/core/Box";
import { styled } from "@material-ui/core/styles";
import { updateUiCommon } from 'store/common/slice/commonSlice';

const StyledSpanBox = styled(Box)({
  maxWidth: 700,
  padding: '20px',
});

const ProductDetail = () => {

  const param = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLogin = useSelector(state => state.admin.isLogin);
  const listProduct = useSelector(state => state.admin.informationAdmin.items);
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const errorMessage = useSelector(state => state.uiCommon.errorMessage);
  const type = useSelector(state => state.uiCommon.type);

  let productDetail = null;
  if (listProduct && listProduct.length > 0) {
    productDetail = listProduct.filter(item => item.itemId === param.id);
  }

  const closeModalHandle = () => {
    dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
  };

  useEffect(() => {
    if (!isLogin) {
      navigate('/host/admin/login', {replace: true});
    }
  }, [isLogin, navigate])

  if (isLoading && !type) {
    return (<LoadingSpinner />);
  }

  return (
    <React.Fragment>
      <ErrorModal isModal={errorMessage ?  true : false} onClose={closeModalHandle}>{errorMessage}</ErrorModal>
      <StyledSpanBox
        sx={{
          background: '#fff',
          minHeight: '100%',
          py: 3,
          height: '100%',
        }}
      >
        <CommonToolbar />
        { productDetail && productDetail.length > 0 && productDetail.map(item => (
          <ProductDetailForm
            key ={item.itemId}
            {...item}
            type="edit"
            itemId={param.id}
          />
        ))};

      </StyledSpanBox>
    </React.Fragment>
  )
};

export default ProductDetail;
