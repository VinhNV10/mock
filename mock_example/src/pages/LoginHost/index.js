import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate, useLocation, useParams } from 'react-router-dom';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import TextField from '@material-ui/core/TextField';

import {
  Box,
  Button,
  Container,
  Link,
  Typography
} from '@material-ui/core';

import UseAxios from 'hook/useAxios';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import ErrorModal from 'components/Layout/ErrorModal';
import { updateUiCommon } from 'store/common/slice/commonSlice';
import { onLogin } from 'store/host/slice/hostSlice';

const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

const initialValues = {
  phoneNumber: '',
};

const validationSchema = Yup.object().shape({
  phoneNumber: Yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required('Phone number is required'),
});

const LoginHost = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const {sendRequest } = UseAxios();

  const isLogin = useSelector(state => state.host.isLogin);
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const errorMessage = useSelector(state => state.uiCommon.errorMessage);
  const type = useSelector(state => state.uiCommon.type);
  const linkRegister = `${location.pathname.replace('/login', '')}/register`;

  useEffect(() => {
    if (isLogin) {
      navigate(`${location.pathname.replace('/login', '')}`, {replace: false});
    }
  }, [isLogin, location.pathname, navigate]);

  const closeModalHandle = () => {
    dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
  };

  const loginHandle = (phoneNumber) => {
    dispatch(updateUiCommon({loading: true, error: '', type: 'SUBMIT' }));
    sendRequest({
      method: 'POST',
      url: '/Customer/login',
      headers: {'Content-Type': 'application/json'},
      data: {
        phoneNumber
      }
    }).then((response) => {
      if (!response.customerId) {
        dispatch(updateUiCommon({ loading: false, error: 'Phone number invalid', type: '' }));
      } else {
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));

        const customerId = response.customerId;
        dispatch(onLogin({shopId: params.id, customerId}));

        sessionStorage.removeItem('hostId');
        sessionStorage.setItem('hostId', customerId);

        navigate(location.pathname.replace('/login', ''), {replace: false});

      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: error.response?.data ?? 'Some thing is wrong', type: '' }));
    });
  }

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
              initialValues={initialValues}
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
                      Sign in on the store
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
                    <Link component={RouterLink} to={linkRegister} variant="h6" underline="hover">
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

export default LoginHost;