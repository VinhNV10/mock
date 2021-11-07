import { useState, useContext } from "react";
import AuthContext from "../../store/auth-context";
import URL_API from "../../serve/url";
import classes from "./CardList.module.css";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Button, Spinner } from "react-bootstrap";

const CardList = (props) => {
  const authCtx = useContext(AuthContext);
  const [isBusy, setBusy] = useState(false);

  const removeItem = (event) => {
    const itemId = event.currentTarget.closest("li").getAttribute("data-id");
    setBusy(true);
    const dataReq = {
      itemId: itemId,
      customerId: authCtx.customerId,
      CartId: authCtx.cardId,
    };
    const urlAPi = `${URL_API}/api/Cart/remove/item`;
    fetch(urlAPi, {
      method: "POST",
      body: JSON.stringify(dataReq),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        props.getCardInfo(false);
        setBusy(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const createOrder = () => {
    debugger;
    const dataReq = {
      CartId: authCtx.cardId,
      deliveryInformation: 'Confirmed',
    };
    const urlAPi = `${URL_API}/api/Order`;
    fetch(urlAPi, {
      method: "POST",
      body: JSON.stringify(dataReq),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        props.getCardInfo(false);
        setBusy(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  const submit = () => {
    setBusy(true);
    const dataReq = {
      customerId: authCtx.customerId,
      CartId: authCtx.cardId,
      items: props.data.itemsInCart
    };
    const urlAPi = `${URL_API}/api/Cart/submit`;
    fetch(urlAPi, {
      method: "POST",
      body: JSON.stringify(dataReq),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        createOrder();
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <div>
      <h2>Order</h2>
      {props.data.itemsInCart && props.data.itemsInCart.length > 0 && (
        <ul className={classes.listItem}>
          {props.data.itemsInCart.map((item, index) => (
            <li className={classes.itemWrap} key={index} data-id={item.itemId}>
              <img
                className="card-img-top"
                src={`data:image/png;base64, ${item.image}`}
                alt="item"
              />
              <div>
                <p>{item.itemName}</p>
                <p>${item.price}</p>
                <p>Total: {item.amount}</p>
                {!isBusy && (
                  <RiDeleteBin2Line
                    className={classes.iconRemove}
                    onClick={removeItem}
                  />
                )}
                {isBusy && (
                  <Button variant="primary" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Loading...</span>
                  </Button>
                )}
              </div>
            </li>
          ))}
          <li className={classes.itemWrap} key="total">
            <Button variant="success" onClick={submit}>Submit</Button>
            <p className={classes.totalPrice}>Total: ${props.data.totalPrice}</p>
          </li>
        </ul>
      )}
      {(!props.data.itemsInCart || props.data.itemsInCart === 0) && <p>List is empty</p>}
    </div>
  );
};

export default CardList;
