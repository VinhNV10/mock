import propTypes from 'prop-types';

import { Typography, FormControl } from "@material-ui/core";
import './TrackingHeader.scss';

TrackingHeader.propTypes = {
  date: propTypes.string,
  orderId: propTypes.string,
  customerName: propTypes.string
}

TrackingHeader.defaultProps = {
  date: '',
  orderId: '',
  customerName: '',
};

function TrackingHeader(props) {

  const { date, orderId, customerName } = props;
  return (
    <div className="tracking-header">
      <div>
        <Typography variant="h2" gutterBottom align="left">Order</Typography>
        <FormControl margin="dense">
          <Typography variant="h5" gutterBottom align="left">
              Date{' '}
          </Typography>
          <Typography gutterBottom variant="span" align="center">
              {new Date(date).toLocaleDateString()}
          </Typography>
        </FormControl>
      </div>
      <div>
        <FormControl margin="dense">
          <Typography variant="h5" gutterBottom align="center">
            Order Id
          </Typography>
          <Typography gutterBottom variant="span" align="center">
            {orderId}
          </Typography>
        </FormControl>
      </div>
      <div>
      <FormControl margin="dense">
        <Typography variant="h2" gutterBottom align="left">
            Customer
          </Typography>
          <Typography variant="h5" gutterBottom align="left">
            {customerName}
          </Typography>
        </FormControl>
      </div>
    </div>
  )
};

export default TrackingHeader;
