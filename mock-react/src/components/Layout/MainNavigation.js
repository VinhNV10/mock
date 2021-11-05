import { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
    // optional: redirect the user
    window.location.href = window.location.origin;
  };

  const viewShopPath = `/host/admin/${authCtx.token}`;

  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>TOP</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to='/auth'>Register</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <a href={viewShopPath}>View Shop</a>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
