import React, {useState, useEffect} from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PropTypes from "prop-types";

import './ErrorModal.scss';

ErrorModal.propTypes = {
  isModal: PropTypes.bool,
  onClose: PropTypes.func
}

ErrorModal.defaultProps = {
  isModal: false,
  onClose: () => {}
}

function ErrorModal(props) {
  const { isModal, onClose } = props;

  const [open, setOpen] = useState(isModal);

  useEffect(() => {
    setOpen(isModal);
  }, [isModal]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="error-modal"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="error-modal__paper">
            <h2>An error occurred!</h2>
            <p>{props.children}</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default ErrorModal;