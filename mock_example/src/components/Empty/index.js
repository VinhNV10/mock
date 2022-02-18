import React from 'react';

import PropTypes from 'prop-types';

import {
  Box,
  Container,
  Typography
} from '@material-ui/core';

Empty.propsType = {
  title: PropTypes.string,
  img: PropTypes.string,
  altImg: PropTypes.string
}

function Empty(props){

  const {title, img, altImg } = props;
  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            align="center"
            color="textPrimary"
            variant="h1"
          >
            {title}
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <img
              alt={altImg}
              src={img}
              style={{
                marginTop: 50,
                display: 'inline-block',
                maxWidth: '100%',
                width: 560
              }}
            />
          </Box>
        </Container>
      </Box>
    </React.Fragment>
  );
}

export default Empty;