import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Outlet } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';

import { ToastContainer } from 'react-toastify'

import UseAxios from 'hook/useAxios';
import MainNavbar from './GuestNavbar';
import { onLogin } from 'store/guest/slice/guestSlice';
import { fetchGuest } from 'store/guest/action/actionSlice';

import 'react-toastify/dist/ReactToastify.css'

const GuestRoot = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  })
);

const GuestWrapper = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: 64
});

const GuestContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const GuestContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto'
});

const Guest = () => {

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const { id } = params;
  const isLogin = useSelector(state => state.guest.isLogin);
  const customerId = useSelector(state => state.guest.customerId);

  const { sendRequest } = UseAxios();

  useEffect(() => {
    if (!isLogin) {
      const customerId = sessionStorage.getItem('guestId');
      if (customerId) {
        dispatch(onLogin({customerId, cartId: id}));
      }
    } else {
      if (customerId) {
        dispatch(fetchGuest(navigate, sendRequest, id, customerId));
      }
    }
  }, [dispatch, isLogin, id, navigate, customerId, sendRequest]);

  return (
    <GuestRoot>
      {isLogin && <MainNavbar /> }
      <GuestWrapper>
        <GuestContainer>
          <GuestContent>
          <ToastContainer
            autoClose={2000}
            style={{ minWidth: "375px" }}
          />
            <Outlet />
          </GuestContent>
        </GuestContainer>
      </GuestWrapper>
    </GuestRoot>
  )
};

export default Guest;