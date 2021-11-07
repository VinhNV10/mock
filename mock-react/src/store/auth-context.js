import React, { useState, useCallback } from 'react';

const AuthContext = React.createContext({
  token: '',
  customerId: '',
  cardId: '',
  isLoggedIn: false,
  login: (token) => {},
  loginCustomer: (customerId) => {},
  setCardId: (cardId) => {},
  logout: () => {},
});

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  return {
    token: storedToken,
  };
};
const retrieveStoredCustomer = () => {
  const storedCustomer = localStorage.getItem('customerId');
  return {
    customer: storedCustomer,
  };
};
const retrieveStoredCard = () => {
  const storedCard = localStorage.getItem('cardId');
  return {
    card: storedCard,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  const customerData = retrieveStoredCustomer();
  const cardData = retrieveStoredCard();
  
  let initialToken;
  let initialCustomer;
  let initialCard;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  if (customerData) {
    initialCustomer = customerData.customer;
  }

  if (cardData) {
    initialCard = cardData.card;
  }

  const [token, setToken] = useState(initialToken);
  const [customerId, setCustomer] = useState(initialCustomer);
  const [cardId, setCard] = useState(initialCard);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const loginHandler = token => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const loginCustomer = customerId => {
    setCustomer(customerId);
    localStorage.setItem('customerId', customerId);
  };

  const setCardId = cardId => {
    setCard(cardId);
    localStorage.setItem('cardId', cardId);
  };

  const contextValue = {
    token: token,
    customerId: customerId,
    cardId: cardId,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    loginCustomer: loginCustomer,
    setCardId: setCardId,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
