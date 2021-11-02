import { useState, useContext, useEffect } from "react";
import { isEmpty } from "lodash";

import classes from "./ShopViewMenu.module.css";
import URL_API from "../../serve/url";
import AuthContext from "../../store/auth-context";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Menu from './Menu';
import Orders from './Orders';

const ShopViewMenu = () => {
  const authCtx = useContext(AuthContext);
  const [menuInfo, setMenuInfo] = useState({});
  const [ordersList, setOrderList] = useState({});
  const [isViewMenu, setView] = useState(true);

  useEffect(() => {
    const getShopInfo = () => {
      const urlAPi = `${URL_API}/api/Shop/${authCtx.token}`;
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
          setMenuInfo(data);
        })
        .catch((err) => {
          alert(err.message);
        });
    };
    getShopInfo();
  }, []);

  const getOrdersList = () => {
    const urlAPi = `${URL_API}/api/Order/${authCtx.token}/shop/all`;
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
        setOrderList(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const copyShopLink = (event) => {
    const url =
      event.target.value === "0"
        ? `${window.location.protocol}${window.location.host}/host/admin/${authCtx.token}`
        : `${window.location.protocol}${window.location.host}/host/shop/${authCtx.token}`;
    navigator.clipboard.writeText(url);
  };

  const toggleView = () => {
    if (isEmpty(ordersList)) getOrdersList();
    setView((prevState) => !prevState);
  };

  return (
    <div className={classes.wrap}>
      <h1>
        Welcome to{" "}
        <a className={classes.shopName} href={`/host/admin/${authCtx.token}`}>
          {menuInfo.name}
        </a>{" "}
        shop
      </h1>
      <div className={classes.wrapBtn}>
        <div>
          <Button variant="danger" value="0" onClick={copyShopLink}>
            Copy link shop
          </Button>{" "}
          <Button variant="info" value="1" onClick={copyShopLink}>
            Share link shop
          </Button>
        </div>
        <Button variant="dark" value="1" onClick={toggleView}>
          View {isViewMenu ? "Orders" : "Menu"}
        </Button>
      </div>
      <div className={classes.shopView}>
        <Card className={classes.shopInfo}>
          <Card.Img
            variant="top"
            src={`data:image/png;base64, ${menuInfo.image}`}
          />
          <Card.Body>
            <Card.Title>Shop Card</Card.Title>
            <p>
              <u>Author:</u> VinhNV10
            </p>
            <p>
              <u>Phone number:</u> {menuInfo.phoneNumber}
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
        <div className={classes.listContent}>
          <p >List {isViewMenu ? 'Menu' : 'Orders'}</p>
          {isViewMenu && <Menu />}
          {!isViewMenu && <Orders />}
        </div>
      </div>
    </div>
  );
};

export default ShopViewMenu;
