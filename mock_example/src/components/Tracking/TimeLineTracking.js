import propTypes from 'prop-types';

import './TimeLineTracking.scss';

TimeLineTracking.propTypes = {
  deliveryInformation: propTypes.string,
}

TimeLineTracking.defaultProps = {
  deliveryInformation: '',
};

function TimeLineTracking(props) {

  const { status } = props;

  let step = 0;

  switch (status) {
    case 'Ready for PicUp':
      step = 1;
      break;
    case 'Confirmed':
      step = 2;
      break;
  
    case 'Sent To Kitchen':
      step = 3;
      break;

    case 'Delivered':
      step = 4;
      break;
    case 'Cancelled':
      step = 5;
      break;
    default:
      break;
  }

  if (step === 5) {
    return (<p>You have removed your purchase order</p>)
  }

  return (
    <ul className="timeline">
      <li className={step >= 1 ? 'timeline__list complete' : 'timeline__list'}>
        <div className="timeline__status">
          <label>Sent To Kitchen</label>
        </div>
      </li>
      <li className={step >= 2 ? 'timeline__list complete' : 'timeline__list'}>
        <div className="timeline__status">
          <label>Confirmed</label>
        </div>
      </li>
      <li className={step >= 3 ? 'timeline__list complete' : 'timeline__list'}>
        <div className="timeline__status">
          <label>Ready for PicUp</label>
        </div>
      </li>
      <li className={step >= 4 ? 'timeline__list complete' : 'timeline__list'}>
        <div className="timeline__status">
          <label>Delivered</label>
        </div>
      </li>
    </ul>
  )
};

export default TimeLineTracking;
