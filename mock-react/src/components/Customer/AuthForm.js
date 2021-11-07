import { useState, useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import URL_API from "../../serve/url";
import classes from "./AuthForm.module.css";
import { Button, Spinner } from "react-bootstrap";

const AuthForm = () => {
  const authCtx = useContext(AuthContext);

  const nameCustomerInputRef = useRef();
  const phoneNumberInputRef = useRef();
  const imageInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  // Call API to register customer
  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNameShop = nameCustomerInputRef.current.value;
    const enteredPhoneNumber = phoneNumberInputRef.current.value;
    const enteredIamge = imageInputRef.current;
    setIsLoading(true);

    let formData = new FormData();
    formData.append("Name", enteredNameShop);
    formData.append("PhoneNumber", enteredPhoneNumber);
    formData.append("Avatar", enteredIamge.files[0]);

    const urlAPi = `${URL_API}/api/Customer/register`;
    fetch(urlAPi, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        setIsLoading(false);
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
        const shopId = window.location.pathname.replace("/shop/", "")
        authCtx.loginCustomer(data.customerId);
        authCtx.login(shopId);

        // Create new Card
        createCard(data.customerId, shopId);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // Call API to create new Card
  const createCard = (customerId, shopId) => {
    const urlAPi = `${URL_API}/api/Cart/create`;
    fetch(urlAPi, {
      method: "POST",
      body: JSON.stringify({
        customerId: customerId,
        shopId: shopId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
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
        authCtx.setCardId(data.cartId);
        const theURL = window.location.pathname;
        const newURL = theURL.replace(theURL, `/card/${data.cartId}`);
        window.location.href = `${newURL}`;
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <div className={classes.profile}>
      <h1>Welcome</h1>
      <h2>Please input info</h2>
      {!isLoading && (
        <form onSubmit={submitHandler} className={classes.form}>
          <div className={classes.control}>
            <label htmlFor="nameCustomer">Customer Name</label>
            <input
              type="text"
              id="nameCustomer"
              required
              ref={nameCustomerInputRef}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="tel">Phone Number</label>
            <input
              type="text"
              pattern="\d*"
              id="tel"
              required
              ref={phoneNumberInputRef}
            />
          </div>
          <div className={classes.control}>
              <label htmlFor="img">Avatar</label>
              <input
                type="file"
                id="img"
                required
                ref={imageInputRef}
              />
            </div>
          <Button variant="info" onClick={submitHandler}>
            Save
          </Button>
        </form>
      )}
      {isLoading && (
        <div className={classes.spiner}>
          <Spinner animation="border" variant="danger" />
        </div>
      )}
    </div>
  );
};

export default AuthForm;
