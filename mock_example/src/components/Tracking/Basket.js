import React from 'react';
import propTypes from 'prop-types';
import { Container } from "@material-ui/core";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './Basket.scss';

Basket.propTypes = {
  image: propTypes.string,
  itemName: propTypes.string,
  amount: propTypes.number,
  price: propTypes.number,
}

Basket.defaultProps = {
  image: '',
  itemName: '',
  amount: 0,
  price: 0,
};

function Basket (props) {

  const { image, itemName, amount, price } = props;

  return (
    <React.Fragment>
      <Container>
        <div className="cart-root">
          <div className="cart-root__content">
            <div className="cart-root__img">
              <LazyLoadImage
                effect='blur'
                src={`data:image/jpeg;base64,${image}`}
                className="productItem__img"
                alt={itemName}
                width='100%'
                height='100%'
              />
            </div>
            <div className="cart-root__description">
              <div>{itemName}</div>
              <div className="cart-root__amount">X{amount}</div>
            </div>
          </div>
          <div className="cart-root__price">${price}</div>
        </div>
      </Container>
    </React.Fragment>
  )
};

export default Basket;