import CartItem from './CartItem';
import Empty from 'components/Empty';

import cartEmpty from 'assets/svgs/Shop/empty-cart.svg';

import { styled } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import OtherCart from './OtherCart';


const CartListRoot = styled('div')({
  padding: '20px 15px',
  marginBottom: 'auto',
  overflowY: 'auto',
  height: '100%',
  backgroundColor: '#f4f6f8',
});

const CartListRootEmpty = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  height: '100%',
});

const CartListWrapper= styled('div')({
  width: '100%',
});

const CartList = () => {

  const personCart = useSelector(state => state.cart.personCart);
  const listGuest = useSelector(state => state.cart.listGuest);
  const otherPersonCart = useSelector(state => state.cart.otherPersonCart);
  
  return (
    <CartListRoot>
      {personCart.length === 0 && otherPersonCart.length === 0 && (
        <CartListRootEmpty>
          <CartListWrapper>
            <Empty
              title="There is no cart you are looking for 🕵️"
              img={cartEmpty}
              altImg="Cart Empty"
            />
          </CartListWrapper>
        </CartListRootEmpty>
      )}
      { personCart.length >= 0 && personCart.map(item => (
        <CartItem key={item.itemId} {...item} />
      ))}
      {listGuest.length >= 0 && listGuest.map((item, index) => (
        <OtherCart key={index} {...item} />
      ))}
    </CartListRoot>
  )
};

export default CartList;