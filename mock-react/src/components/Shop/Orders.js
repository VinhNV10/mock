const Orders = (props) => {
  return (
    <div>
      {props.data.length > 0 && (
        <ul>
          {props.data.map((item) => (
            <li>
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      )}
      {props.data.length === 0 && <p>List is empty</p>}
    </div>
  );
};

export default Orders;
