import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import UseAxios from 'hook/useAxios';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import { updateUiCommon } from 'store/common/slice/commonSlice';
import { editProfile } from 'store/admin/slice/adminSlice';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Container,
  Grid,
  IconButton,
  CardHeader,
  TextField
} from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { makeStyles } from '@material-ui/styles';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: '10px',
    },
  },
  input: {
    display: 'none',
  },
  label: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: '14px',
  },
}));

ProfFileAdminForm.propTypes = {
  name: PropTypes.string,
  phoneNumber: PropTypes.string,
  image: PropTypes.string,
}

const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

function ProfFileAdminForm(props) {

  const classes = useStyles();
  const dispatch = useDispatch();
  const {sendRequest } = UseAxios();

  const { name, phoneNumber, image } = props;
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const type = useSelector(state => state.uiCommon.type);

  const initialValues = {
    shopName: name,
    phoneNumber: phoneNumber,
    newPhoneNumber: '',
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
    newPhoneNumber: Yup
        .string()
        .matches(phoneRegExp, "Phone number is not valid")
  });

  const updateFrofileHandle = (data) => {
    dispatch(updateUiCommon({ loading: true, error: '', type: 'EDIT' }));
    sendRequest({
      method: 'PUT',
      url: '/Shop',
      data: data.formData
    }).then((response) => {
      if (response.phoneNumber) {
        dispatch(editProfile({shopName: data.formData.get('name'), phoneNumber: response.phoneNumber }));
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
        toast('🦄 Update Profile successfully!', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        dispatch(updateUiCommon({ loading: false, error: 'Update Profile UnSuccessfully!', type: '' }));
      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: error.response?.data ?? 'Some thing is wrong', type: '' }));
    });
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            const formData = new FormData();
            formData.append('name', values.shopName);
            formData.append('phoneNumber', values.phoneNumber);

            if (values.newPhoneNumber) {
              formData.append('newPhoneNumber', values.newPhoneNumber);
            }

            if (values.logo) {
              formData.append('logo', values.logo, values.logo.name);
            }
            updateFrofileHandle({formData});

          }}
        >
          { propsFormik => {
            const { values, handleChange, touched, errors, setFieldValue } = propsFormik;
            return (
              <Form>
                <Container maxWidth="lg">
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      lg={4}
                      md={6}
                      xs={12}
                    >
                      <Card>
                        <CardContent>
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <Avatar
                              src={values.logo? URL.createObjectURL(values.logo) : image ? `data:image/jpeg;base64,${image}` : null}
                              alt={values.logo? values.logo.name : image ? name : null}
                              sx={{
                                height: 100,
                                width: 100
                              }}
                            />
                            <Typography
                              color="textPrimary"
                              gutterBottom
                              variant="h3"
                            >
                              {name}
                            </Typography>
                            <Typography
                              color="textSecondary"
                              variant="body1"
                            >
                              {phoneNumber}
                            </Typography>
                          </Box>
                        </CardContent>
                        <Divider />
                        <CardActions className={classes.label}>
                          <input
                            accept="image/*"
                            className={classes.input}
                            id="icon-button-file"
                            type="file"
                            name="logo"
                            onChange={(event) => {
                              setFieldValue('logo', event.target.files[0])
                            }}
                          />
                          <label htmlFor="icon-button-file">
                            <IconButton color="primary" aria-label="upload picture" component="span" className={classes.logo}>
                              <PhotoCamera />
                              Upload Logo
                            </IconButton>
                          </label>
                        </CardActions>
                        </Card>
                      </Grid>
                    <Grid
                      item
                      lg={8}
                      md={6}
                      xs={12}
                    >
                      <Card>
                        <CardHeader
                          subheader="The information can be edited"
                          title="Profile"
                        />
                        <Divider />
                        <CardContent>
                          <Grid
                            container
                            spacing={3}
                          >
                            <Grid
                              item
                              md={6}
                              xs={12}
                            >
                              <TextField
                                error={Boolean(touched.shopName && errors.shopName)}
                                helperText={touched.shopName && errors.shopName}
                                fullWidth
                                id="shopName"
                                name="shopName"
                                label="Shop Name"
                                type="text"
                                onChange={handleChange}
                                value={values.shopName}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid
                              item
                              md={6}
                              xs={12}
                            >
                              <TextField
                                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                helperText={touched.phoneNumber && errors.phoneNumber}
                                fullWidth
                                id="phoneNumber"
                                name="phoneNumber"
                                label="Phone Number"
                                type="text"
                                onChange={handleChange}
                                value={values.phoneNumber}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid
                              item
                              md={6}
                              xs={12}
                            >
                              <TextField
                                fullWidth
                                id="newPhoneNumber"
                                name="newPhoneNumber"
                                label="Phone New Number"
                                type="text"
                                onChange={handleChange}
                                value={values.newPhoneNumber}
                                variant="outlined"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                        <Divider />
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            p: 2
                          }}
                        >
                          <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                          >
                            Save Profile
                          </Button>
                          {isLoading && type === 'EDIT' && <LoadingSpinner />}
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </Container>
              </Form>
            )
          }}
        </Formik>
      </Box>
    </React.Fragment>
  )
};

export default ProfFileAdminForm;