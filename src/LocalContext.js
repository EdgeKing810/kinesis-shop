import React, { useEffect, useState } from 'react';

import axios from 'axios';

const LocalContext = React.createContext();

function LocalContextProvider({ children }) {
  const APIURL = 'https://api.connect.kinesis.games';
  const UPLOADSURL = 'https://uploads.connect.kinesis.games';

  const [loggedInUser, setLoggedInUser] = useState({});
  const [uusers, setUsers] = useState([]);
  const [pproducts, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const users = [{ uid: '1', name: 'Kishan' }];

  const products = [
    {
      productID: 1,
      name: 'product-1',
      images: [
        'uploads/2021/1/4/11/56/20/ecdeade0-3b09-4149-8f45-a9296b9a4a01/cleanbanner.png',
        '/uploads/2021/1/4/11/58/22/96166839-c780-4a0f-98ac-d741a06db603/images.png',
        'uploads/2021/1/4/11/44/56/8d6df1e9-e89f-4769-8c4d-fe523f3776ef/banner.png',
      ],
      price: 999,
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
      // amount: 10,
      // reviews: [
      //   {
      //     reviewID: 1,
      //     review: 'My first review!',
      //     date: '2021-01-13T21:06:02.503Z',
      //     rating: '3.4',
      //     uid: '1',
      //   },
      //   {
      //     reviewID: 2,
      //     review: 'My second review!',
      //     date: '2021-01-13T21:06:02.503Z',
      //     rating: '2.2',
      //     uid: '1',
      //   },
      // ],
    },
    {
      productID: 2,
      name: 'product-2',
      images: [
        '/uploads/2021/1/4/11/58/22/96166839-c780-4a0f-98ac-d741a06db603/images.png',
      ],
    },
    {
      productID: 3,
      name: 'product-3',
      images: [
        'uploads/2021/1/4/11/44/56/8d6df1e9-e89f-4769-8c4d-fe523f3776ef/banner.png',
      ],
    },
    {
      productID: 4,
      name: 'product-4',
      images: [
        'uploads/2021/1/4/11/56/20/ecdeade0-3b09-4149-8f45-a9296b9a4a01/cleanbanner.png',
      ],
      reviews: [{ rating: 1 }, { rating: 3.4 }, { rating: 1.8 }],
    },
    {
      productID: 5,
      name: 'product-5',
      images: [
        '/uploads/2021/1/4/11/58/22/96166839-c780-4a0f-98ac-d741a06db603/images.png',
      ],
    },
    {
      productID: 6,
      name: 'product-6',
      images: [
        'uploads/2021/1/4/11/44/56/8d6df1e9-e89f-4769-8c4d-fe523f3776ef/banner.png',
      ],
    },
    {
      productID: 7,
      name: 'product-7',
      images: [
        'uploads/2021/1/4/11/56/20/ecdeade0-3b09-4149-8f45-a9296b9a4a01/cleanbanner.png',
      ],
    },
    {
      productID: 8,
      name: 'product-8',
      images: [
        '/uploads/2021/1/4/11/58/22/96166839-c780-4a0f-98ac-d741a06db603/images.png',
      ],
    },
    {
      productID: 9,
      name: 'product-9',
      images: [
        'uploads/2021/1/4/11/44/56/8d6df1e9-e89f-4769-8c4d-fe523f3776ef/banner.png',
      ],
    },
    {
      productID: 10,
      name: 'product-10',
      images: [
        'uploads/2021/1/4/11/56/20/ecdeade0-3b09-4149-8f45-a9296b9a4a01/cleanbanner.png',
      ],
    },
    {
      productID: 11,
      name: 'product-11',
      images: [
        '/uploads/2021/1/4/11/58/22/96166839-c780-4a0f-98ac-d741a06db603/images.png',
      ],
    },
    {
      productID: 12,
      name: 'product-12',
      images: [
        'uploads/2021/1/4/11/44/56/8d6df1e9-e89f-4769-8c4d-fe523f3776ef/banner.png',
      ],
    },
  ];

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
    speed: 1500,
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

      setLoggedInUser({ uid: data.uid });

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
        settings,
      }}
    >
      {children}
    </LocalContext.Provider>
  );
}

export { LocalContext, LocalContextProvider };
