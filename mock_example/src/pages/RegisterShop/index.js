import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

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
import ErrorModal from 'components/Layout/ErrorModal';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import { updateUiCommon } from 'store/common/slice/commonSlice';

import { toast } from 'react-toastify';

const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

const initialValues = {
  shopName: '',
  phoneNumber: '',
  logo: null,
};

const validationSchema = Yup.object().shape({
  shopName: Yup
    .string()
    .required("Shop name is required."),
  phoneNumber: Yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required('Phone number is required'),
});

const RegisterShop = () => {

  const {sendRequest } = UseAxios();
  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const errorMessage = useSelector(state => state.uiCommon.errorMessage);
  const type = useSelector(state => state.uiCommon.type);

  const closeModalHandle = () => {
    dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
  };

  const registerAccountHandle = ({formData, resetForm}) => {

    dispatch(updateUiCommon({loading: true, error: '', type: 'SUBMIT' }));

    sendRequest({
      method: 'POST',
      url: '/Shop/register',
      data: formData
    }).then((response) => {
      if (!response.shopId) {
        dispatch(updateUiCommon({ loading: false, error: 'PhoneNumber already registered.', type: '' }));
      } else {
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
        resetForm();
        toast('🦄 Register account successfully!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              const formData = new FormData();
              formData.append('phoneNumber', values.phoneNumber);
              formData.append('name', values.shopName);
              if (values.logo) {
                formData.append('logo', values.logo, values.logo.name);
              }

              registerAccountHandle({formData, resetForm: actions.resetForm});
            }}
          >
          { propsFormik => {
            const { values, handleChange, touched, errors, setFieldValue } = propsFormik;
            return (
              <Form>
                <Box>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Create new account
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Use phone number to create new account
                  </Typography>
                </Box>

                <TextField
                  error={Boolean(touched.shopName && errors.shopName)}
                  helperText={touched.shopName && errors.shopName}
                  fullWidth
                  margin="normal"
                  id="shopName"
                  name="shopName"
                  label="Shop Name"
                  type="text"
                  onChange={handleChange}
                  value={values.shopName}
                  variant="outlined"
                />

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

                <TextField
                  fullWidth
                  label="Logo Shop"
                  margin="normal"
                  name="logo"
                  type="file"
                  variant="outlined"
                  onChange={(event) => {
                    setFieldValue('logo', event.target.files[0])
                  }}
                  inputProps={{style: {marginLeft: 85}}}
                />

                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                  { isLoading && type === 'SUBMIT' && <LoadingSpinner />}
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Have an account?
                  {' '}
                  <Link component={RouterLink} to="/host/admin/login" variant="h6" underline="hover">
                    Sign in
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

export default RegisterShop;
