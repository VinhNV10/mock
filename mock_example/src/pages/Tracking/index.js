import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Basket from '../../components/Tracking/Basket';
import TimeLineTracking from '../../components/Tracking/TimeLineTracking';
import TrackingHeader from 'components/Tracking/TrackingHeader';
import UseAxios from 'hook/useAxios';
import LoadingSpinner from 'components/Layout/LoadingSpinner';
import { updateUiCommon } from 'store/common/slice/commonSlice';

import { Container, Box, Card, CardContent, Typography } from "@material-ui/core";
import { LogLevel, HubConnectionBuilder } from '@microsoft/signalr';

const Spacer = () => <Box m={1}>&nbsp;</Box>;

const Tracking = () => {

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sendRequest } = UseAxios();
  
  const [trackingInformation, setTrackingInformation] = useState();
  const orderId = params.id;
  const isLoading = useSelector(state => state.uiCommon.isLoading);

  const fetchOrder = useCallback(() => {
    dispatch(updateUiCommon({ loading: true, error: '', type: '' }));
    sendRequest({
      method: 'GET',
      url: `/Order/${orderId}`,
    }).then((response) => {
      if (response.customerId) {
        setTrackingInformation(response) 
        dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
      }
    }).catch((error) => {
      dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
      navigate('/404');
    });
  }, [dispatch, navigate, orderId, sendRequest])

  const startCons = useCallback(async function() {
      
    const connection = new HubConnectionBuilder()
    .withUrl(`http://localhost:8080/hubs/order?order=${orderId}`, {
      withCredentials: false
    })
    .configureLogging(LogLevel.Information)
    .build();

    try {
      await connection.start();
    } catch(e) {
      console.log(e);
    }

    connection.on('ChangeOrderStatus', (message) => {fetchOrder()});
    connection.on('CancelOrder', (message) => {fetchOrder()});
  }, [fetchOrder, orderId]);
  

  let customerName = '';
  if (trackingInformation && trackingInformation.itemsInCart.length >= 0) {
    for (const key in trackingInformation.itemsInCart) {
      if (trackingInformation.customerId === trackingInformation.itemsInCart[key].customerId) {
        customerName = trackingInformation.itemsInCart[key].customerName;
        break;
      }
    }
  }

  useEffect(() => {
    startCons();
    fetchOrder();
  }, [startCons,fetchOrder])

  if (isLoading) {
    return (<LoadingSpinner />)
  }

  return (
    <Box
      sx={{
        minHeight: '100%',
        py: 3
      }}
    >
      { trackingInformation && trackingInformation.customerId && (
        <Container
          sx={{
            padding: '0 10px',
          }}
        >
          <Card>
            <CardContent>
              <TrackingHeader
                date={trackingInformation.orderTime}
                orderId={orderId}
                customerName={customerName}
              />
              <Spacer />
              <Typography variant="h3" gutterBottom align="left">
                Order Status
              </Typography>
              <TimeLineTracking status={trackingInformation.status} />
              <Spacer />
              { trackingInformation.itemsInCart.map((item) => (
                  <Basket key={item.itemId} {...item} />
              ))}
              <Typography 
                variant="h3"
                gutterBottom
                align="right"
                sx={{
                  marginTop: '10px',
                  color: '#ff514e',
                  padding: '0 20px',
                }}
              >
                Total: ${trackingInformation.totalPrice}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      )}
    </Box>
  )
};

export default Tracking;
