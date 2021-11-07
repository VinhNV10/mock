import { useContext, useState } from "react";
import classes from "./ShopMenu.module.css";
import URL_API from "../../serve/url";
import { Button, Spinner } from "react-bootstrap";
import AuthContext from "../../store/auth-context";

const ShopMenu = (props) => {
  const authCtx = useContext(AuthContext);
  const [isBusy, setBusy] = useState(false);

  const addToCard = (event) => {
    const itemId = event.currentTarget.closest("li").getAttribute("data-id");
    const dataReq = {
      itemId: itemId,
      customerId: authCtx.customerId,
      CartId: authCtx.cardId,
    };

    setBusy(true);
    const urlAPi = `${URL_API}/api/Cart/add/item`;
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
            setBusy(false);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        setBusy(false);
        console.log(data);
        props.getCardInfo(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <div>
      {props.data.length > 0 && (
        <ul className={classes.listItem}>
          {props.data.map((item, index) => (
            <li className={classes.itemWrap} key={index} data-id={item.itemId}>
              <img
                className="card-img-top"
                src={`data:image/png;base64, ${item.image}`}
                alt="item"
              />
              <div>
                <p>{item.name}</p>
                <p>${item.price}</p>
                {!isBusy && (
                  <Button variant="info" onClick={addToCard}>
                    Add to card
                  </Button>
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
        </ul>
      )}
      {props.data.length === 0 && <p>List is empty</p>}
    </div>
  );
};

export default ShopMenu;
