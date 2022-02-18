import { useDispatch, useSelector } from 'react-redux';
import propTypes from 'prop-types';
import { Form, Formik } from 'formik';

import Basket from './Basket';
import UseAxios from 'hook/useAxios';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import { updateUiCommon } from 'store/common/slice/commonSlice';

import {
  Card,
  CardContent,
  Box,
  Toolbar,
  Typography,
  FormControl,
  Button,
  MenuItem,
  TextField
} from '@material-ui/core';
import { toast } from 'react-toastify';

import * as yup from "yup";

import './OrderEditForm.scss';

const Spacer = () => <Box m={1}>&nbsp;</Box>;

const option = [
  {
    name: 'Status',
    value: 0
  },
  {
    name: 'Ready for PicUp',
    value: 1
  },
  {
    name: 'Confirmed',
    value: 2
  },
  {
    name: 'Sent To Kitchen',
    value: 3
  },
  {
    name: 'Delivered',
    value: 4
  },
  {
    name: 'Cancelled',
    value: 5
  },
]

OrderEditForm.propTypes = {
  orderDetail: propTypes.object,
  orderId: propTypes.string,
  onChangeStatusOrder: propTypes.func
}

OrderEditForm.defaultProps = {
  orderDetail: {},
  orderId: '',
  onChangeStatusOrder: () => {},
};

function OrderEditForm(props) {

  const {sendRequest } = UseAxios();
  const dispatch = useDispatch();

  const { orderDetail, orderId, onChangeStatusOrder } = props;
  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const type = useSelector(state => state.uiCommon.type);

  let customerName = '';
  let defaultStatus = 0;
  if (orderDetail && orderDetail.itemsInCart.length >= 0) {
    for (const key in orderDetail.itemsInCart) {
      if (orderDetail.customerId === orderDetail.itemsInCart[key].customerId) {
        customerName = orderDetail.itemsInCart[key].customerName;
      }
    }

    for (const key in option) {
      if (option[key].name === orderDetail.status) {
        defaultStatus = option[key].value;
      }
    }
  }

  const validationSchema = yup.object().shape({
    status: yup
      .number()
      .moreThan(defaultStatus, 'You not change the status or change status not correct')
      .required('Status is required'),
  });

  const changeStatus = (valueStatus) => {
    onChangeStatusOrder(valueStatus);
  };

  const changeStatusOrder = (orderStatus) => {
    dispatch(updateUiCommon({ loading: true, error: '', type: 'EDIT' }));
    sendRequest({
      method: 'PUT',
      url: '/Order/status',
      data: {
        orderId,
        orderStatus,
        customerId: orderDetail.customerId,
        shopId: orderDetail.shopId,
      }
    }).then((response) => {
      if (response.isSuccess) {
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
        changeStatus(orderStatus);
        toast('Change status is successfully!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        dispatch(updateUiCommon({ loading: false, error: response.errorMessage, type: '' }));
      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: 'Some thing is wrong', type: '' }));
    });
  }

  const cancelOrder = (orderStatus) => {
    dispatch(updateUiCommon({ loading: true, error: '', type: 'EDIT' }));
    sendRequest({
      method: 'PUT',
      url: '/Order/cancel',
      data: {
        orderId,
        customerId: orderDetail.customerId,
      }
    }).then((response) => {
      if (response.isSuccess) {
        changeStatus(orderStatus);
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
        toast('Cancel order is successfully!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        dispatch(updateUiCommon({ loading: false, error: response.errorMessage, type: '' }));
      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: 'Some thing is wrong', type: '' }));
    });
  }

  return (
    <Formik
      initialValues={{
        status: defaultStatus
      }}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values, actions) => {
        let orderStatus = '';
        switch (values.status) {
          case 1:
            orderStatus = 'Ready for PicUp';
            break;
          case 2:
            orderStatus = 'Confirmed';
            break;
          case 3:
            orderStatus = 'Sent To Kitchen';
            break;
          case 4:
            orderStatus = 'Delivered';
            break;
          case 5:
            orderStatus = 'Cancelled';
            break;
          default:
            break;
        }
        if (values.status === 5) {
          cancelOrder(orderStatus);
        } else {
          changeStatusOrder(orderStatus);
        }
      }}
    >
      { propsFormik => {
        const { values, handleChange, touched, errors } = propsFormik;
        return (
          <Form>
            <Card sx={{ backgroundColor: '#fff' }}>
              <CardContent>
                <div className="orderDetail-header">
                  <div>
                    <Typography variant="h4" gutterBottom align="left">Order</Typography>
                    <FormControl margin="dense">
                      <Typography variant="h5" gutterBottom align="left">
                        Date{' '}
                      </Typography>
                      <Typography gutterBottom variant="span" align="left">
                        {new Date(orderDetail.orderTime).toLocaleDateString()}
                      </Typography>
                      <Spacer />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl margin="dense">
                      <Typography variant="h4" gutterBottom align="center">
                        Order Id
                      </Typography>
                      <Typography gutterBottom variant="span" align="center">
                        {orderId}
                      </Typography>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl margin="dense">
                      <Typography variant="h4" gutterBottom align="left">
                        Customer
                      </Typography>
                      <Typography variant="h5" gutterBottom align="left">
                        {customerName}
                      </Typography>
                    </FormControl>
                  </div>
                </div>
                <TextField
                  style={{ width: "200px" }}
                  className="px-1 my-1"
                  variant="outlined"
                  name="status"
                  id="status"
                  select
                  label="Status"
                  value={values.status}
                  onChange={handleChange}
                  error={
                    touched.status &&
                    Boolean(errors.status)
                  }
                  helperText={
                    touched.status && errors.status
                  }
                >
                  { option && option.map((item, index) => (
                    <MenuItem
                      value={item.value}
                      key={index}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Spacer />
                <Typography variant="h2" gutterBottom align="left">
                  Item
                </Typography>
                <Basket listProductOrder={orderDetail.itemsInCart} totalPrice={orderDetail.totalPrice}/>
              </CardContent>
            </Card>
            <Toolbar sx={{ backgroundColor: '#f5f5f5' }}>
              <div className="toolbarWrapper">
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  Change Status
                </Button>
                { isLoading && type === 'EDIT' && <LoadingSpinner /> }
              </div>
            </Toolbar>
          </Form>
        )
      }}
    </Formik>
  )
};

export default OrderEditForm;
