import { useState, useRef, useContext } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";
import URL_API from "../../serve/url";

const AuthForm = () => {

  const nameShopInputRef = useRef();
  const phoneNumberInputRef = useRef();
  const imageInputRef = useRef();
  const shopIdRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitToView = (event) => {
    event.preventDefault();
    const enteredShopId = shopIdRef.current.value;
    setIsLoading(true);

    const urlAPi = `${URL_API}/api/Shop/login`;
    fetch(urlAPi, {
      method: "POST",
      body: JSON.stringify({
        phoneNumber: enteredShopId,
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
        setIsLoading(false);
        authCtx.login(data.shopId);
        const theURL = window.location.pathname;
        const newURL = theURL.replace(theURL, `/admin/${data.shopId}`);
        window.location.href = `${newURL}`;
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err.message);
      });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNameShop = nameShopInputRef.current.value;
    const enteredPhoneNumber = phoneNumberInputRef.current.value;
    const enteredIamge = imageInputRef.current;
    setIsLoading(true);

    let formData = new FormData();
    formData.append('PhoneNumber', enteredPhoneNumber);
    formData.append('Name', enteredNameShop);
    formData.append('Logo', enteredIamge.files[0]);

    const urlAPi = `${URL_API}/api/Shop/register`;
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
        authCtx.login(data.shopId);
        const theURL = window.location.pathname;
        const newURL = theURL.replace(theURL, `/admin/${data.shopId}`);
        window.location.href = `${newURL}`;
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Register shop"}</h1>
      <div>
        {isLogin && (
          <form onSubmit={submitToView}>
            <div className={classes.control}>
              <label htmlFor="shopId">Your Phone</label>
              <input type="text" id="shopId" required ref={shopIdRef} />
            </div>
            <div className={classes.actions}>
              <button>Login</button>
            </div>
          </form>
        )}
      </div>
      <div>
        {!isLogin && (
          <form onSubmit={submitHandler}>
            <div className={classes.control}>
              <label htmlFor="nameShop">Shop Name</label>
              <input
                type="text"
                id="nameShop"
                required
                ref={nameShopInputRef}
              />
            </div>
            <div className={classes.control}>
              <label htmlFor="tel">Phone number</label>
              <input
                type="text"
                pattern="\d*"
                id="tel"
                required
                ref={phoneNumberInputRef}
              />
            </div>
            <div className={classes.control}>
              <label htmlFor="img">Image</label>
              <input
                type="file"
                id="img"
                required
                ref={imageInputRef}
              />
            </div>
            <div className={classes.actions}>
              {!isLoading && <button>Register shop</button>}
              {isLoading && <p>Sending request...</p>}
            </div>
          </form>
        )}
      </div>
      <button
        type="button"
        className={classes.toggle}
        onClick={switchAuthModeHandler}
      >
        {isLogin ? "Register new shop" : "Login with existing shop"}
      </button>
    </section>
  );
};

export default AuthForm;
