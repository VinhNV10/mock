import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import UseAxios from 'hook/useAxios';
import { fetchAdmin } from 'store/admin/action/adminAction';
import { getSessionLogin } from '../../../store/admin/action/adminAction';

import { Outlet } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

const AdminLayoutRoot = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  })
);

const AdminLayoutWrapperLogin = styled('div')(
  ({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  })
);

const AdminLayoutWrapperLogout = styled('div')(
  ({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  })
);

const AdminLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const AdminLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto'
});

const AdminLayout = () => {

  const dispatch = useDispatch();
  const { sendRequest } = UseAxios();

  const isLogin = useSelector(state => state.admin.isLogin);
  const shopId = useSelector(state => state.admin.shopId);

  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const mobileCloseHandler = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  useEffect(() => {
    if (!isLogin) {
      dispatch(getSessionLogin());
    } else {
      dispatch(fetchAdmin(shopId, sendRequest));
    }
  }, [isLogin, dispatch, shopId, sendRequest]);

  return (
    <AdminLayoutRoot>
      { isLogin && <AdminNavbar onMobileNavOpen={() => setMobileNavOpen(true)} />}
      { isLogin && (
        <AdminSidebar
          onMobileClose={mobileCloseHandler}
          openMobile={isMobileNavOpen}
        />
      )}
      { isLogin ? (
        <AdminLayoutWrapperLogin>
          <AdminLayoutContainer>
            <AdminLayoutContent>
              <ToastContainer
                autoClose={2000}
                style={{ minWidth: "375px" }}
              />
              <Outlet />
            </AdminLayoutContent>
          </AdminLayoutContainer>
        </AdminLayoutWrapperLogin>
      ) : (
        <AdminLayoutWrapperLogout>
          <AdminLayoutContainer>
            <AdminLayoutContent>
              <ToastContainer autoClose={2000} />
              <Outlet />
            </AdminLayoutContent>
          </AdminLayoutContainer>
        </AdminLayoutWrapperLogout>
      )}
    </AdminLayoutRoot>
  );
};

export default AdminLayout;
