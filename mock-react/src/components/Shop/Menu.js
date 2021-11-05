import { useState } from "react";
import classes from "./Menu.module.css";
import { Figure, Modal, Button } from "react-bootstrap";
import { FaWindowClose } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";

const Menu = (props) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [shopId, setShopId] = useState("");

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (event) => {
    setShowDelete(true);
    getShopId(event);
  }

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (event) => {
    setShowEdit(true);
    getShopId(event);
  }

  const getShopId = (event) => {
    const targetItem = event.currentTarget.parentElement;
    setShopId(targetItem.getAttribute("data-id"));
  };

  const deleteAction = () => {
    props.deleteItem(shopId);
  };

  const updateAction = () => {
    props.updateItem(shopId);
  }

  return (
    <div>
      {props.data.length && (
        <ul className={classes.itemList}>
          {props.data.map((item, index) => (
            <li className={classes.itemWrap} key={index} data-id={item.itemId}>
              <Figure>
                <Figure.Image
                  width={400}
                  height={300}
                  className={classes.imgFluid}
                  alt="171x180"
                  src={`data:image/png;base64, ${item.image}`}
                />
                <Figure.Caption>
                  <p className={classes.itemText}>
                    <b>Name: </b>
                    {item.name}
                  </p>
                  <p className={classes.itemText}>
                    <b>Price: </b>
                    {item.price}$
                  </p>
                </Figure.Caption>
              </Figure>
              <FaWindowClose
                className={classes.iconClose}
                onClick={handleShowDelete}
              />
              <GrEdit className={classes.iconEdit} onClick={handleShowEdit} />
            </li>
          ))}
        </ul>
      )}
      {props.data.length === 0 && <p>List is empty</p>}
      <div>
        <Modal show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm delete Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to delete it?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              No
            </Button>
            <Button variant="primary" onClick={deleteAction}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div>
        <Modal show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Update Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Input to update Item</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              No
            </Button>
            <Button variant="primary" onClick={updateAction}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Menu;
