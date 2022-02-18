import propTypes from 'prop-types';

import { Box, Typography, Checkbox, FormControlLabel } from "@material-ui/core";
import { useSelector } from 'react-redux';
import CartItem from './CartItem';

OtherCart.propTypes = {
  guestId: propTypes.string,
  guestName: propTypes.string,
};

OtherCart.defaultProps = {
  guestId: '',
  guestName: '',
};

function OtherCart(props) {
  
  const { guestId, guestName, statusSubmit } = props;

  const otherPersonCart = useSelector(state => state.cart.otherPersonCart);
  
  return (
    <Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
      }}>
        <Typography
          color="textPrimary"
          variant="h4"
          sx={{
            padding: '10px 0',
            backgroundColor: 'background.default',
          }}
        >
          {guestName}
        </Typography>
        <div>
          <FormControlLabel
            sx={{
              marginLeft: '10px'
            }}
            control={
              <Checkbox
                checked={statusSubmit}
                name="checkedB"
                color="primary"
                disabled
              />
            }
            label={ statusSubmit ? 'Complete' : 'UnComplete' }
          />
        </div>
      </Box>
      {otherPersonCart.map(item => item.customerId === guestId ? (
          <CartItem key={item.itemId} {...item} />
        ) : (
          ""
        )
      )}
    </Box>
  )
};

export default OtherCart;