import PropTypes from 'prop-types';
import ShopItem from './ShopItem';

import './ShopList.scss';

ShopList.propTypes = {
  shopList: PropTypes.array,
}

ShopList.defaultProps = {
    shopList: [],
};

function ShopList (props) {
  const { shopList } = props;
  return (
    <div className="shop">
      <div className="shop__list">
        {shopList.map((item) => (
          <ShopItem key={item.itemId} {...item} />
        ))}
      </div>
    </div>
  )
};

export default ShopList;