import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import {
  Box,
  Button,
  Container,
  Link,
  Typography,
  TextField
} from '@material-ui/core';

import UseAxios from 'hook/useAxios';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import ErrorModal from 'components/Layout/ErrorModal';
import { onLogin } from 'store/admin/slice/adminSlice';
import { updateUiCommon } from 'store/common/slice/commonSlice';

const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

const validationSchema = Yup.object().shape({
  phoneNumber: Yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required('Phone number is required'),
});

const LoginShop = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sendRequest } = UseAxios();

  const isLogin = useSelector(state => state.admin.isLogin);
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const errorMessage = useSelector(state => state.uiCommon.errorMessage);
  const type = useSelector(state => state.uiCommon.type);

  useEffect(() => {
    if (!isLogin) {
      navigate('/host/admin/login', {replace: true});
    }
  }, [isLogin, navigate])

  const closeModalHandle = () => {
    dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
  };

  const loginHandle = (phoneNumber) => {

    dispatch(updateUiCommon({loading: true, error: '', type: 'SUBMIT' }));

    sendRequest({
      method: 'POST',
      url: '/Shop/login',
      data: {
        phoneNumber
      }
    }).then((response) => {
      if (!response.shopId) {
        dispatch(updateUiCommon({ loading: false, error: 'Phone number invalid', type: '' }));
      } else {
        const shopId = response.shopId;
        dispatch(onLogin(shopId));
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
  
        sessionStorage.removeItem('shopId');
        sessionStorage.setItem('shopId', shopId);

        navigate('/host/admin', {replace: false});
      }

    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: error.response?.data ?? 'Some thing is wrong', type: '' }));
    });
  };

  return (
    <React.Fragment>
      <ErrorModal isModal={errorMessage ?  true : false} onClose={closeModalHandle}>{errorMessage}</ErrorModal>
      <Box
          sx={{
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center'
          }}
        >
          <Container maxWidth="sm">
            <Formik
              initialValues={{
                phoneNumber: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                loginHandle(values.phoneNumber);
              }}
            >
            { propsFormik => {
              const { values, handleChange, touched, errors } = propsFormik;
              return (
                <Form>
                  <Box>
                    <Typography
                      color="textPrimary"
                      variant="h2"
                    >
                      Sign in
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Sign in on the Shop
                    </Typography>
                  </Box>
                  <TextField
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    fullWidth
                    margin="normal"
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    onChange={handleChange}
                    value={values.phoneNumber}
                    variant="outlined"
                  />
                  <Box sx={{ py: 2 }}>
                    <Button
                      color="primary"
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Sign in now
                    </Button>
                    { isLoading && type === 'SUBMIT' && <LoadingSpinner /> }
                  </Box>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Don&apos;t have an account?
                    {' '}
                    <Link component={RouterLink} to="/host/admin/register" variant="h6" underline="hover">
                      Sign up
                    </Link>
                  </Typography>
                </Form>
              )
            }}
            </Formik>
          </Container>
        </Box>
    </React.Fragment>
  )
}

export default LoginShop;
