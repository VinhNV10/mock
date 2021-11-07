import { useState, useContext, useEffect } from "react";

import classes from "./ShopViewMenu.module.css";
import URL_API from "../../serve/url";
import AuthContext from "../../store/auth-context";
import { Button, Card, Spinner } from "react-bootstrap";

import Menu from "./Menu";
import Orders from "./Orders";
import AddItemForm from "./AddItemForm";

const ShopViewMenu = (props) => {
  const authCtx = useContext(AuthContext);
  const [isBusy, setBusy] = useState(true);
  const [shopInfo, setshopInfo] = useState({});
  const [ordersList, setOrderList] = useState({});
  const [isViewMenu, setView] = useState(true);
  const [show, setShow] = useState(false);
  const [listItem, setListItem] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getShopInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Call API to get shop infor and list items
  const getShopInfo = () => {
    setBusy(true);
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
        setshopInfo(data);
        const listItem = data.items.filter((item) => item.isActive);
        setListItem(listItem);
        setBusy(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // Call API to get list orders
  const getOrdersList = () => {
    setBusy(true);
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
        setBusy(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // Call API to add new item
  const addItem = (enteredDataItem) => {
    setBusy(true);
    enteredDataItem.append("ShopId", authCtx.token);
    const urlAPi = `${URL_API}/api/Item/create`;
    fetch(urlAPi, {
      method: "POST",
      body: enteredDataItem,
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
      .then(() => {
        getShopInfo();
      })
      .catch((err) => {
        alert(err.message);
      });
    handleClose();
  };

  // Call API to remove item
  const deleteItem = (enteredItemId) => {
    setBusy(true);
    const urlAPi = `${URL_API}/api/Item`;
    fetch(urlAPi, {
      method: "DELETE",
      body: JSON.stringify({
        ItemId: enteredItemId,
        shopId: authCtx.token,
      }),
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
      .then(() => {
        getShopInfo();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // Call API to remove item
  const updateItem = (enteredItemInput) => {
    setBusy(true);
    const urlAPi = `${URL_API}/api/Item`;
    fetch(urlAPi, {
      method: "PUT",
      body: JSON.stringify({
        itemId: enteredItemInput,
        shopId: authCtx.token,
      }),
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
      .then(() => {
        getShopInfo();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const changeStatus = (value, orderStatus) => {
    const urlAPi = `${URL_API}/api/Order/status`;
    fetch(urlAPi, {
      method: "PUT",
      body: JSON.stringify({
        orderId: value.orderId,
        OrderStatus: orderStatus,
        customerId: value.customerId,
        shopId: value.shopId,
      }),
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
      .then(() => {
        getOrdersList();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const cancelOrder = (value) => {
    const urlAPi = `${URL_API}/api/Order/cancel`;
    fetch(urlAPi, {
      method: "PUT",
      body: JSON.stringify({
        orderId: value.orderId,
        customerId: value.customerId,
      }),
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
        alert(data.errorMessage);
        getOrdersList();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const copyShopLink = (event) => {
    const url =
      event.target.value === "0"
        ? `${window.location.protocol}${window.location.host}/admin/${authCtx.token}`
        : `${window.location.protocol}${window.location.host}/shop/${authCtx.token}`;
    navigator.clipboard.writeText(url);
  };

  const toggleView = () => {
    if (isViewMenu) getOrdersList();
    else getShopInfo();
    setView((prevState) => !prevState);
  };

  return (
    <div className={classes.wrap}>
      <h1>
        Welcome to{" "}
        <a className={classes.shopName} href={`/admin/${authCtx.token}`}>
          {shopInfo.name}
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
      {!isBusy && (
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
          <div className={classes.listContent}>
            <div className={classes.listContent__header}>
              <p className={classes.listContent__title}>
                List {isViewMenu ? "Menu" : "Orders"}
              </p>
              {isViewMenu && (
                <Button variant="primary" onClick={handleShow}>
                  Add new item
                </Button>
              )}
            </div>
            {isViewMenu && (
              <Menu
                data={listItem}
                deleteItem={deleteItem}
                updateItem={updateItem}
              />
            )}
            {!isViewMenu && (
              <Orders
                data={ordersList.orders}
                changeStatus={changeStatus}
                cancelOrder={cancelOrder}
              />
            )}
          </div>
        </div>
      )}
      {isBusy && (
        <div className={classes.spiner}>
          <Spinner animation="border" variant="danger" />
        </div>
      )}
      <AddItemForm
        handleClose={handleClose}
        addItem={addItem}
        show={show}
      ></AddItemForm>
    </div>
  );
};

export default ShopViewMenu;
