import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';

import NavBar from './Components/NavBar';
import Home from './Components/Home';
import Product from './Components/Product';
import Login from './Components/Login';
import Profile from './Components/Profile';
import Cart from './Components/Cart';
import Order from './Components/Order';

export default function App() {
  return (
    <div className="w-full">
      <Route>
        <div className="w-screen h-screen">
          <NavBar />

          <Switch>
            <Route exact path="/">
              <Home />
            </Route>

            <Route exact path="/product/:productID">
              <Product />
            </Route>

            <Route exact path="/sign-in">
              <Login />
            </Route>

            <Route exact path="/profile">
              <Profile />
            </Route>

            <Route exact path="/cart">
              <Cart />
            </Route>

            <Route exact path="/order/:orderID">
              <Order />
            </Route>

            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </div>
      </Route>
    </div>
  );
}
