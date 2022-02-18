import PropTypes from 'prop-types';

import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

AdminNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

AdminNavbar.defaultProps = {
  onMobileNavOpen: () => {},
};

function AdminNavbar(props) {
  const { onMobileNavOpen, ...rest } = props;

  return (
    <AppBar
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen} size="large">
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;