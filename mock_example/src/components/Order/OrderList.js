import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';

import './OrderList.scss';

OrderList.propTypes = {
  columns: propTypes.array,
  rows: propTypes.array,
}

OrderList.defaultProps = {
  columns: [],
  rows: [],
};

function OrderList(props) {

  const { columns, rows } = props;

  const className = (status) => {
    if (status === 'Ready for PicUp') {
      return 'readyForPicUp';
    } else if (status === 'Confirmed') {
      return 'confirmed';
    } else if (status === 'Sent To Kitchen') {
      return 'sentToKitchen';
    } else if (status === 'Delivered') {
      return 'delivered';
    } else if (status === 'Cancelled') {
      return 'cancelled';
    } else {
      return 'newOrder';
    }
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          minHeight: '100%',
          py: 3
        }}
      >
        <Paper className="container">
          <TableContainer className="container">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  { columns.map((column, index) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontSize: 16 }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.orderId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">{row.orderId}</TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>{row.customerPhoneNumber}</TableCell>
                    <TableCell><span className={className(row.status)}>{row.status ? row.status : 'New Order'}</span></TableCell>
                    <TableCell>{row.totalPrice}</TableCell>
                    <TableCell><Link to={`${row.orderId}`}>View</Link></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </React.Fragment>
  )
};

export default OrderList;
