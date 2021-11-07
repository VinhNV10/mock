import { useState, useContext, useEffect } from "react";
import classes from "./CardView.module.css";
import URL_API from "../../serve/url";
import AuthContext from "../../store/auth-context";
import { Button, Card, Spinner } from "react-bootstrap";
import ShopMenu from "./ShopMenu";
import CardList from "./CardList";

const CardView = () => {
  const authCtx = useContext(AuthContext);
  const [isBusyShop, setBusyShop] = useState(true);
  const [isBusyOrder, setBusyOrder] = useState(true);
  const [shopInfo, setshopInfo] = useState({});
  const [listItem, setListItem] = useState({});
  const [orderInfo, setListItemInCard] = useState({});

  // Call API to get shop infor and list items
  const getShopInfo = (shopId) => {
    const urlAPi = `${URL_API}/api/Shop/${shopId}`;
    fetch(urlAPi, {
      method: "GET",
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
        setshopInfo(data);
        const listItem = data.items.filter((item) => item.isActive);
        setListItem(listItem);
        setBusyShop(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // Call API to get card info
  const getCardInfo = (isFirst = true) => {
    setBusyOrder(true);
    if (isFirst) {
      setBusyShop(true);
    }
    const cardId = window.location.pathname.replace("/card/", "");
    const urlAPi = `${URL_API}/api/Cart/${cardId}`;
    fetch(urlAPi, {
      method: "GET",
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
        if (isFirst) {
          authCtx.login(data.shopId);
          authCtx.loginCustomer(data.customerId);
          authCtx.setCardId(data.cartId);
          getShopInfo(data.shopId);
        }
        if (data.itemsInCart.length > 0) getItemInCard();
        else {
          setBusyOrder(false);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // Call API to get card info
  const getItemInCard = () => {
    const dataReq = {
      customerId: authCtx.customerId,
      shopId: authCtx.token,
    };
    const urlAPi = `${URL_API}/api/Cart/exist/shop/customer`;
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
        setListItemInCard(data);
        setBusyOrder(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    getCardInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyShopLink = () => {
    const url = `${window.location.protocol}${window.location.host}/card/${authCtx.cardId}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className={classes.cardWrap}>
      <h1>
        Welcome to{" "}
        <a className={classes.shopName} href={`/admin/${authCtx.token}`}>
          {shopInfo.name}
        </a>{" "}
        shop
      </h1>
      <div className={classes.wrapBtn}>
        <div>
          <Button variant="primary" onClick={copyShopLink}>
            Share link card
          </Button>
        </div>
      </div>
      <div className={classes.wrapContent}>
        {!isBusyShop && !isBusyOrder && (
          <div className={classes.shopView}>
            <Card className={classes.shopInfo}>
              <Card.Img
                variant="top"
                src={`data:image/png;base64, ${shopInfo.image}`}
              />
              <Card.Body>
                <p>
                  <u>Author:</u> VinhNV10
                </p>
                <p>
                  <u>Phone number:</u> {shopInfo.phoneNumber}
                </p>
                <p>
                  <u>Address:</u> FPT-Complex{" "}
                  <a
                    target="blank"
                    href="https://www.google.com/maps/place/FPT+Complex+%C4%90%C3%A0+N%E1%BA%B5ng/@15.978364,108.2620564,523m/data=!3m1!1e3!4m5!3m4!1s0x0:0x51c64b1130497f99!8m2!3d15.9783846!4d108.2620725"
                  >
                    Go map
                  </a>
                </p>
              </Card.Body>
            </Card>
            <div className={classes.menuWrap}>
              <p>Menu</p>
              <ShopMenu data={listItem} getCardInfo={getCardInfo} />
            </div>
          </div>
        )}
        {!isBusyShop && !isBusyOrder && (
          <div className={classes.orderView}>
            <CardList data={orderInfo} getCardInfo={getCardInfo} />
          </div>
        )}
      </div>
      {(isBusyShop || isBusyOrder) && (
        <div className={classes.spiner}>
          <Spinner animation="border" variant="danger" />
        </div>
      )}
    </div>
  );
};

export default CardView;
