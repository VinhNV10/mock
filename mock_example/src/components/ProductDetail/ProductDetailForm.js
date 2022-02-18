import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import LoadingSpinner from 'components/Layout/LoadingSpinner';
import UseAxios from 'hook/useAxios';
import { updateUiCommon } from 'store/common/slice/commonSlice';
import { addItemProduct, editItemProduct } from 'store/admin/slice/adminSlice';

import { Form, Formik } from 'formik';
import { Toolbar, Button, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { styled } from "@material-ui/core/styles";
import { toast } from 'react-toastify';

import * as yup from "yup";

ProductDetailForm.propTypes = {
  productName: PropTypes.string,
  price: PropTypes.number,
  type: PropTypes.string,
  itemId: PropTypes.string,
}

ProductDetailForm.defaultProps = {
  name: '',
  price: 0,
  type: '',
  itemId: '',
};

const StyledButtonSave = styled(Button)({
  fontSize: 14
});

const StyledIconSave = styled(SaveIcon)({
  marginRight: 10
});

const ToolbarWrapper = styled('div')({
  display: 'flex',
  flex: '1',
  justifyContent: 'center',
});

const StyledImg = styled('img')({
  width: '100%',
  maxHeight: '25rem',
  filter: 'blur(0)',
});

function ProductDetailForm(props) {

  const { name, price, image, type, itemId } = props;

  const initialValues = {
    productName: name,
    price: price,
    image: '',
  };

  const validationSchema = yup.object().shape({
    productName: yup
      .string()
      .required("Product name is required."),
    price: yup
      .number()
      .moreThan(0, 'Price is value bigger 0')
      .required('Price is required'),
  });

  const {sendRequest } = UseAxios();
  const dispatch = useDispatch();

  const shopId = useSelector(state => state.admin.shopId);
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const typeAPI = useSelector(state => state.uiCommon.type);

  const addItemProductHandle = ({formData, resetForm}) => {
    dispatch(updateUiCommon({ loading: true, error: '', type:'ADD' }));
    sendRequest({
      method: 'POST',
      url: '/Item/create',
      data: formData
    }).then((response) => {
      if (response.itemId) {
        dispatch(updateUiCommon({ loading: false, error: '', type:'' }));
        dispatch(addItemProduct({
          itemId: response.itemId,
          name: response.name,
          price: response.price,
          isActive: response.isActive,
          shopId: shopId,
          image: response.image,
        }));
        resetForm();
        toast('Add Product successfully!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        dispatch(updateUiCommon({ loading: false, error: 'Added product Unsuccessful', type:'' }));
      }
      
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: error.response?.data ?? 'Some thing is wrong', type:'' }));
    });
  }

  const editItemProductHandle = (data) => {
    let formData = new FormData();
    formData = data.formData;
    formData.append('ItemId', itemId);
    dispatch(updateUiCommon({ loading: true, error: '', type: 'EDIT' }));
    sendRequest({
      method: 'PUT',
      url: '/Item',
      data: formData
    }).then((response) => {
      if (response.name) {
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
        dispatch(editItemProduct({
          itemId: itemId,
          name: response.name,
          price: response.price,
          image: response.image,
        }));
        toast('Edit Product is successfully!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        dispatch(updateUiCommon({ loading: false, error: 'Update Unsuccessful', type: '' }));
      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: error.response?.data ?? 'Some thing is wrong', type: '' }));
    });
  };

  return (
    <React.Fragment>
      { isLoading && (typeAPI === 'EDIT' || typeAPI === 'ADD') && <LoadingSpinner /> }
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          const formData = new FormData();
          formData.append('shopId', shopId);
          formData.append('name', values.productName);
          formData.append('price', values.price);
          if (values.image) {
            formData.append('image', values.image, values.image.name);
          }
          if (type && type === 'edit') {
            editItemProductHandle({formData, actions});
          } else {
            addItemProductHandle({formData, resetForm: actions.resetForm});
          }
        }}
      >
        { propsFormik => {
          const { values, handleChange, touched, errors, setFieldValue } = propsFormik;
          return (
            <Form>
              <TextField
                error={Boolean(touched.productName && errors.productName)}
                helperText={touched.productName && errors.productName}
                fullWidth
                margin="normal"
                id="productName"
                name="productName"
                label="Product Name"
                type="text"
                onChange={handleChange}
                value={values.productName}
                variant="outlined"
              />
              <TextField
                error={Boolean(touched.price && errors.price)}
                helperText={touched.price && errors.price}
                fullWidth
                margin="normal"
                id="productName"
                name="price"
                label="Price"
                type="text"
                onChange={handleChange}
                value={values.price}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Image Product"
                margin="normal"
                name="image"
                type="file"
                variant="outlined"
                onChange={(event) => {
                  setFieldValue('image', event.target.files[0])
                }}
                inputProps={{style: {marginLeft: 110}}}
              />

              <StyledImg
                src={values.image? URL.createObjectURL(values.image) : image ? `data:image/jpeg;base64,${image}` : null}
                alt={values.image? values.image.name : image ? values.productName : null}
              />

              <Toolbar>
                <ToolbarWrapper>
                  <StyledButtonSave variant="contained" size="small" type="submit">
                  <StyledIconSave/>Save</StyledButtonSave>
                </ToolbarWrapper>
              </Toolbar>
            </Form>
          )
        }}
      </Formik>
    </React.Fragment>
  )
};

export default ProductDetailForm;