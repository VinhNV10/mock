import Box from "@material-ui/core/Box";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { styled } from "@material-ui/core/styles";

const StyledTableCellTotal = styled(TableCell)({
  fontSize: 14,
  fontWeight: 'bold'
});

function Basket(props) {
  const { listProductOrder, totalPrice } = props;
  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Sub Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listProductOrder.map(item => (
            <TableRow
            key={item.itemId}
            >
              <TableCell>{item.itemName}</TableCell>
              <TableCell align="right">{item.price}</TableCell>
              <TableCell align="right">{item.amount}</TableCell>
              <TableCell align="right">{item.price * item.amount}</TableCell>
            </TableRow>
        ))}
          <TableRow>
            <StyledTableCellTotal colSpan={3}>Total</StyledTableCellTotal>
            <StyledTableCellTotal align="right">{totalPrice}</StyledTableCellTotal>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}

export default Basket;