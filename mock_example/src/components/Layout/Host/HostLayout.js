import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Outlet } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import MainNavbar from './HostNavbar';

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { onLogin } from 'store/host/slice/hostSlice';
import { fetchHost } from 'store/host/action/actionSlice';

import UseAxios from 'hook/useAxios';

const HostRoot = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  })
);

const HostWrapper = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: 64
});

const HostContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const HostContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto'
});

const Host = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendRequest } = UseAxios();

  const {id} = useParams();
  const isLogin = useSelector(state => state.host.isLogin);
  const customerId = useSelector(state => state.host.customerId);

  useEffect(() => {
    if (!isLogin) {
      const customerId = sessionStorage.getItem('hostId');
      if (customerId) {
        dispatch(onLogin({customerId, shopId: id}));
      }
    } else {
      dispatch(fetchHost(navigate, sendRequest, id, customerId));
    }
  }, [dispatch, isLogin, customerId, id, navigate, sendRequest]);

  return (
    <HostRoot>
      {isLogin && <MainNavbar /> }
      <HostWrapper>
        <HostContainer>
          <HostContent>
          <ToastContainer
            autoClose={2000}
            style={{ minWidth: "375px" }}
          />
            <Outlet />
          </HostContent>
        </HostContainer>
      </HostWrapper>
    </HostRoot>
  )
};

export default Host;