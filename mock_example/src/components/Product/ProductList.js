import PropTypes from 'prop-types';
import ProductItem from './ProductItem';

import './ProductList.scss';

ProductList.propTypes = {
  productList: PropTypes.array,
}

ProductList.defaultProps = {
  productList: [],
};

function ProductList (props) {

  const { productList } = props;

  return (
    <div className="product">
      <div className="product__list">
        { productList.map((item) => (
          <ProductItem key={item.itemId} {...item}  />
        ))}
      </div>
    </div>
  )
};

export default ProductList;