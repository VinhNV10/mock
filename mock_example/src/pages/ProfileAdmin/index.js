import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from 'components/Layout/LoadingSpinner';
import ErrorModal  from 'components/Layout/ErrorModal';
import { updateUiCommon } from 'store/common/slice/commonSlice';
import ProfFileAdminForm from 'components/ProfileAdmin/ProfileAdminForm';
import CommonToolbar from 'components/CommonToolbar';

const ProfileAdmin = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLogin = useSelector(state => state.admin.isLogin);
  const name = useSelector(state => state.admin.informationAdmin.name);
  const image = useSelector(state => state.admin.informationAdmin.image);
  const phoneNumber = useSelector(state => state.admin.informationAdmin.phoneNumber);

  const isLoading = useSelector(state => state.uiCommon.isLoading);
  const errorMessage = useSelector(state => state.uiCommon.errorMessage);
  const type = useSelector(state => state.uiCommon.type);

  const closeModalHandle = () => {
    dispatch(updateUiCommon({ loading: false, error: '', type: '' }));
  };

  useEffect(() => {
    if (!isLogin) {
      navigate('/host/admin/login', {replace: true});
    }
  }, [isLogin, navigate])

  if (isLoading && !phoneNumber && !type) {
    return (<LoadingSpinner />);
  }

  return (
    <React.Fragment>
      <ErrorModal isModal={errorMessage?  true : false} onClose={closeModalHandle}>{errorMessage}</ErrorModal>
      { phoneNumber && <CommonToolbar /> }
      { phoneNumber && (
        <ProfFileAdminForm
          name={name}
          image={image}
          phoneNumber={phoneNumber}
        />
      )}
    </React.Fragment>
  )
};

export default ProfileAdmin;