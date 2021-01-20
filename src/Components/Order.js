import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useAlert } from 'react-alert';
import axios from 'axios';

import { LocalContext } from '../LocalContext';

export default function Order() {
  const history = useHistory();

  const {
    APIURL,
    UPLOADSURL,
    loggedInUser,
    users,
    products,
    orders,
    setOrders,
  } = useContext(LocalContext);

  const { orderID } = useParams();
  const alert = useAlert();

  const currentUser =
    users &&
    loggedInUser.uid &&
    loggedInUser.uid !== undefined &&
    users.find((user) => user.uid === loggedInUser.uid);

  const currentOrder =
    orders && orderID ? orders.find((order) => order.orderID === orderID) : {};

  const cartProducts =
    orders.length > 0 &&
    products !== undefined &&
    products.length > 0 &&
    currentOrder.products !== undefined
      ? products.filter((product) =>
          currentOrder.products
            .map((p) => p.productID)
            .includes(product.productID)
        )
      : [];

  useEffect(() => {
    if (
      !orderID ||
      orderID.length < 10 ||
      !loggedInUser.uid ||
      loggedInUser.uid === undefined ||
      !currentUser.address ||
      currentUser.address === undefined ||
      !currentOrder.products ||
      currentOrder.products === undefined
    ) {
      history.push('/');
    }

    // eslint-disable-next-line
  }, []);

  const convertDate = (date) => {
    const oldDate = new Date(date);
    return new Date(
      Date.UTC(
        oldDate.getFullYear(),
        oldDate.getMonth(),
        oldDate.getDate(),
        oldDate.getHours(),
        oldDate.getMinutes(),
        oldDate.getSeconds()
      )
    ).toString();
  };

  const markDelivered = () => {
    let d = new Date();
    const timestamp = new Date(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds()
    );

    if (
      window.confirm('Are you sure of marking this order as being delivered?')
    ) {
      const data = {
        uid: loggedInUser.uid,
        orderID: orderID,
        isDelivered: 'true',
        is_delivered: { status: true, date: timestamp },
      };

      axios
        .post(`${APIURL}/api/shop/order/update`, data, {
          headers: { Authorization: `Bearer ${loggedInUser.jwt}` },
        })
        .then((res) => {
          if (res.data.error === 0) {
            setOrders((prev) =>
              prev.map((order) => {
                if (order.orderID === orderID) {
                  let updatedOrder = { ...order };
                  updatedOrder.is_delivered = data.is_delivered;
                  return updatedOrder;
                } else {
                  return order;
                }
              })
            );

            alert.success('Order Successfully marked as Delivered!');

            history.push('/profile');
          } else {
            console.log(res.data);
          }
        });
    }
  };

  return orderID && currentOrder && currentUser && loggedInUser.uid ? (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex sm:flex-row flex-col sm:justify-around sm:items-start items-center mt-4">
        <div className="sm:w-2/3 w-11/12 flex flex-col">
          <div className="text-gray-800 tracking-wider font-bold sm:text-3xl text-xl sm:mt-0 mt-4">
            Order {orderID}
          </div>

          <div className="w-full mt-2">
            <div className="text-gray-800 sm:text-xl text-lg uppercase tracking-wider font-semibold">
              Shipping
            </div>
            <div className="text-gray-700 sm:text-sm text-xs mt-1">
              Name: {currentUser.name}
            </div>
            <div className="text-gray-700 sm:text-sm text-xs mt-1">
              Address:{' '}
              {`${currentUser.address.postal_code}, ${currentUser.address.address}, ${currentUser.address.city}, ${currentUser.address.state}, ${currentUser.address.country}`}
            </div>

            <div
              className={`w-full py-2 bg-${
                currentOrder.is_delivered.status ? 'green' : 'red'
              }-300 text-${
                currentOrder.is_delivered.status ? 'green' : 'red'
              }-900 sm:text-sm text-xs font-semibold mt-2 text-center opacity-75`}
            >
              {currentOrder.is_delivered.status
                ? `Delivered on ${convertDate(currentOrder.is_delivered.date)
                    .split(' ')
                    .slice(0, 4)
                    .join(' ')}`
                : 'Not Delivered'}
            </div>
          </div>

          <div className="pb-1 w-full bg-gray-400 my-2"></div>

          <div className="w-full">
            <div className="text-gray-800 sm:text-xl text-lg uppercase tracking-wider font-semibold">
              Payment Method
            </div>
            <div className="text-gray-700 sm:text-sm text-xs mt-1">
              Method: PayPal
            </div>

            <div
              className={`w-full py-2 bg-${
                currentOrder.is_paid.status ? 'green' : 'red'
              }-300 text-${
                currentOrder.is_paid.status ? 'green' : 'red'
              }-900 sm:text-sm text-xs font-semibold mt-2 text-center opacity-75`}
            >
              {currentOrder.is_paid.status
                ? `Paid on ${convertDate(currentOrder.is_paid.date)
                    .split(' ')
                    .slice(0, 4)
                    .join(' ')}`
                : 'Not Paid'}
            </div>
          </div>

          <div className="pb-1 w-full bg-gray-400 my-2"></div>

          <div className="text-gray-800 sm:text-xl text-lg uppercase tracking-wider font-semibold">
            Order Items
          </div>

          {cartProducts.map((product, i) => (
            <div
              className="w-full sm:h-20 flex items-center justify-between py-2 sm:px-4 px-2 bg-gray-200 mb-2"
              key={`cart-final-${product.productID}-${i}`}
            >
              <img
                src={`${UPLOADSURL}/${product.images[0]}`}
                alt={`cart-${product.productID}-${i}`}
                className="sm:h-full h-12 w-1/6 object-scale-down mr-2"
              />

              <button
                className="text-gray-700 tracking-wide sm:text-base text-xs font-semibold mt-2 w-2/3 underline hover:no-underline focus:no-underline text-left"
                onClick={() => history.push(`/product/${product.productID}`)}
              >
                {product.name}
              </button>

              <div className="text-gray-800 tracking-wide sm:text-base text-xss font-bold mt-2 w-1/4">
                {`${
                  currentOrder.products.find(
                    (c) => c.productID === product.productID
                  ).amount
                } x $${product.price} = $${
                  parseFloat(product.price) *
                  parseFloat(
                    currentOrder.products.find(
                      (c) => c.productID === product.productID
                    ).amount
                  )
                }`}
              </div>
            </div>
          ))}
        </div>

        <div className="sm:w-1/4 w-11/12 flex flex-col my-2 border-2 border-gray-500">
          <div className="w-full text-left mb-2 sm:text-2xl text-lg tracking-wider text-gray-700 font-bold uppercase mt-2 mx-2">
            Order Summary
          </div>
          <div className="w-full text-left sm:text-base text-sm text-gray-800 border-b-2 border-t-2 border-gray-500 px-2 py-2 flex">
            <div className="w-1/2">Items</div>
            <div className="w-1/2">
              $
              {cartProducts && cartProducts.length > 0
                ? cartProducts.map(
                    (product) =>
                      parseFloat(product.price) *
                      parseFloat(
                        currentOrder.products.find(
                          (c) => c.productID === product.productID
                        ).amount
                      )
                  )
                : 0}
            </div>
          </div>
          <div className="w-full text-left sm:text-base text-sm text-gray-800 border-b-2 border-gray-500 px-2 py-2 flex">
            <div className="w-1/2">Shipping</div>
            <div className="w-1/2">
              $
              {cartProducts && cartProducts.length > 0
                ? cartProducts
                    .map((product) => parseFloat(product.shipping_cost))
                    .reduce((a, b) => a + b, 0)
                : 0}
            </div>
          </div>
          <div className="w-full text-left sm:text-base text-sm text-gray-800 border-b-2 border-gray-500 px-2 py-2 flex">
            <div className="w-1/2">Tax</div>
            <div className="w-1/2">
              $
              {cartProducts && cartProducts.length > 0
                ? cartProducts
                    .map(
                      (product) =>
                        parseFloat(product.price) *
                        parseFloat(
                          currentOrder.products.find(
                            (c) => c.productID === product.productID
                          ).amount
                        )
                    )
                    .reduce((a, b) => a + b, 0) * 0.15
                : 0}
            </div>
          </div>
          <div
            className={`w-full text-left sm:text-base text-sm text-gray-800 ${
              currentUser.is_admin &&
              currentOrder.is_paid.status &&
              !currentOrder.is_delivered.status &&
              'border-b-2'
            } border-gray-500 px-2 py-2 flex`}
          >
            <div className="w-1/2">Total</div>
            <div className="w-1/2">
              $
              {cartProducts && cartProducts.length > 0
                ? cartProducts
                    .map(
                      (product) =>
                        parseFloat(product.price) *
                        parseFloat(
                          currentOrder.products.find(
                            (c) => c.productID === product.productID
                          ).amount
                        )
                    )
                    .reduce((a, b) => a + b, 0) * 1.15
                : 0}
            </div>
          </div>
          {currentUser.is_admin &&
            currentOrder.is_paid.status &&
            !currentOrder.is_delivered.status && (
              <div className="my-4 flex items-center justify-center">
                <button
                  className={`p-2 bg-black border-2 border-black sm:text-lg uppercase text-sm text-gray-200 w-11/12 ${
                    cartProducts && cartProducts.length > 0
                      ? 'hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black'
                      : 'opacity-75'
                  }`}
                  onClick={() => markDelivered()}
                >
                  Mark as Delivered
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`w-11/12 py-4 bg-red-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75`}
    >
      This order doesn't exist.
    </div>
  );
}
