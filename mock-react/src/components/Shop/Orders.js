import { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";

const Orders = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [orderView, setOrderView] = useState({});

  const handleClose = () => setShowModal(false);
  const handleShow = (event) => {
    setOrderView(
      props.data[event.currentTarget.closest("tr").getAttribute("data-index")]
    );
    setShowModal(true);
  };

  const change = (event) => {
    props.changeStatus(orderView, event.currentTarget.value);
  };

  const cancel = (event) => {
    props.cancelOrder(orderView);
  };

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
              <tr data-index={index}>
                <td>{item.orderId}</td>
                <td>{item.customerName}</td>
                <td>{item.customerPhoneNumber}</td>
                <td>{item.totalPrice}</td>
                <td>{item.status ? item.status : "Not yet confirm"}</td>
                <td>
                  {new Date(item.orderTime).toLocaleDateString()} -{" "}
                  {new Date(item.orderTime).toLocaleTimeString()}
                </td>
                <td>
                  <Button variant="link" onClick={handleShow}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {props.data.length === 0 && <p>List is empty</p>}
      <Modal
        show={showModal}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Items in Cart
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Order Number: #{orderView.orderId}</h4>
          <p>Customer Name: {orderView.customerName}</p>
          <p>Customer Phone: {orderView.customerPhoneNumber}</p>
          <p>
            Order Time: {new Date(orderView.orderTime).toLocaleDateString()} -{" "}
            {new Date(orderView.orderTime).toLocaleTimeString()}
          </p>
          <select
            name="status"
            id="status"
            value={orderView.status ? orderView.status : "Not"}
            onChange={change}
          >
            <option value="Not">---</option>
            <option value="Confirmed">Confirmed</option>
            <option value="SentToKitchen">Sent to kitchen</option>
          </select>
          <Button variant="link" onClick={cancel}>
            Cancel
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Sub total</th>
              </tr>
            </thead>
            <tbody>
              {orderView.itemsInCart &&
                orderView.itemsInCart.map((item, index) => (
                  <tr data-index={index}>
                    <td>{item.itemName}</td>
                    <td>{item.price}</td>
                    <td>{item.amount}</td>
                    <td>${item.price * item.amount}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;
