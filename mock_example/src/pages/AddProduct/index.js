import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ProductDetailForm from 'components/ProductDetail/ProductDetailForm';
import CommonToolbar from 'components/CommonToolbar';
import { updateUiCommon } from 'store/common/slice/commonSlice';
import ErrorModal from 'components/Layout/ErrorModal';

import Box from "@material-ui/core/Box";
import { styled } from "@material-ui/core/styles";


const StyledSpanBox = styled(Box)({
  maxWidth: 700,
  padding: '20px',
});

const AddProduct = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.admin.isLogin);
  const errorMessage = useSelector(state => state.uiCommon.errorMessage);

  useEffect(() => {
    if (!isLogin) {
      navigate('/host/admin/login', {replace: true});
    }
  }, [isLogin, navigate])

  const closeModalHandle = () => {
    dispatch(updateUiCommon({ loading: false, error: '' , type: '' }));
  };

  return (
    <StyledSpanBox
      sx={{
        background: '#fff',
        minHeight: '100%',
        py: 3,
      }}
    >
      <CommonToolbar />
      <ErrorModal isModal={errorMessage ?  true : false} onClose={closeModalHandle}>{errorMessage}</ErrorModal>
      <ProductDetailForm />
    </StyledSpanBox>
  )
};

export default AddProduct;
