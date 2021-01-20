import React, { useEffect, useState } from 'react';

import axios from 'axios';

const LocalContext = React.createContext();

function LocalContextProvider({ children }) {
  const APIURL = 'https://api.connect.kinesis.games';
  const UPLOADSURL = 'https://uploads.connect.kinesis.games';

  const [loggedInUser, setLoggedInUser] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  const settings = {
    customPaging: function (i) {
      return (
        <div className="w-6 h-1 bg-gray-500 p-1 flex items-center justify-center -mt-6"></div>
      );
    },
    useTransform: true,
    dots: true,
    dotsClass: 'slick-dots slick-thumb',
    infinite: true,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
    cssEase: 'ease-out',
    centerMode: true,
    centerPadding: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  useEffect(() => {
    if (localStorage.getItem('_userData')) {
      if (loggedInUser.jwt !== undefined && loggedInUser.jwt) {
        return;
      }

      const { uid, jwt } = JSON.parse(localStorage.getItem('_userData'));

      const data = {
        uid,
        profileID: uid,
      };

      setLoggedInUser({ uid: data.uid, jwt: jwt });

      axios
        .post(`${APIURL}/api/shop/products`, data, {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        .then((res) => {
          if (res.data.error === 0) {
            setProducts(res.data.products.reverse());
          }
        });

      axios
        .post(`${APIURL}/api/shop/users`, data, {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        .then((res) => {
          if (res.data.error === 0) {
            setUsers(res.data.users);
            setCurrentUser(res.data.users.find((u) => u.uid === uid));
          }
        });

      axios
        .post(`${APIURL}/api/shop/orders`, data, {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        .then((res) => {
          if (res.data.error === 0) {
            setOrders(res.data.orders.reverse());
          }
        });
    } else {
      axios.post(`${APIURL}/api/shop/products`, {}).then((resp) => {
        if (resp.data.error === 0) {
          setProducts(resp.data.products.reverse());
        } else {
          console.log(resp.data);
        }
      });

      axios.post(`${APIURL}/api/shop/users`, {}).then((resp) => {
        if (resp.data.error === 0) {
          setUsers(resp.data.users);
        } else {
          console.log(resp.data);
        }
      });

      axios.post(`${APIURL}/api/shop/orders`, {}).then((resp) => {
        if (resp.data.error === 0) {
          setOrders(resp.data.orders.reverse());
        } else {
          console.log(resp.data);
        }
      });
    }

    // eslint-disable-next-line
  }, []);

  return (
    <LocalContext.Provider
      value={{
        APIURL,
        UPLOADSURL,
        loggedInUser,
        setLoggedInUser,
        users,
        setUsers,
        products,
        setProducts,
        orders,
        setOrders,
        cart,
        setCart,
        currentUser,
        setCurrentUser,
        settings,
      }}
    >
      {children}
    </LocalContext.Provider>
  );
}

export { LocalContext, LocalContextProvider };
