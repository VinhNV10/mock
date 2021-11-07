import { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import AuthForm from "./components/Customer/AuthForm";
import AuthPage from "./pages/AuthPage";
import CardPage from "./pages/CardPage";
import ShopPage from "./pages/ShopPage";
import HomePage from "./pages/HomePage";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {authCtx.isLoggedIn && (
          <Route path="/admin/:id">
            <ShopPage />
          </Route>
        )}
        {!authCtx.isLoggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        {!authCtx.isLoggedIn && (
          <Route path="/shop/:id">
            <AuthForm />
          </Route>
        )}
        <Route path="/card/:id">
          <CardPage />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
