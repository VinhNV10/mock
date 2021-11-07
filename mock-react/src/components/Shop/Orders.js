import { Table, Button } from "react-bootstrap";

const Orders = (props) => {
  return (
    <div>
      {props.data.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Customer Phone</th>
              <th>Total</th>
              <th>Status</th>
              <th>Order Time</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
          {props.data.map((item, index) => (
            <tr>
              <td>{item.orderId}</td>
              <td>{item.customerName}</td>
              <td>{item.customerPhoneNumber}</td>
              <td>{item.totalPrice}</td>
              <td>{item.deliveryInformation}</td>
              <td>{item.orderTime}</td>
              <td><Button variant="link">View</Button></td>
            </tr>
          ))}
          </tbody>
        </Table>
      )}
      {props.data.length === 0 && <p>List is empty</p>}
    </div>
  );
};

export default Orders;
