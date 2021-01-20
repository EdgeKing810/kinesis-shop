import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Select from 'react-select';
import { useAlert } from 'react-alert';
import axios from 'axios';
import { v4 } from 'uuid';

import { LocalContext } from '../LocalContext';

export default function Product() {
  const history = useHistory();

  const {
    APIURL,
    UPLOADSURL,
    loggedInUser,
    products,
    setProducts,
    setUsers,
    currentUser,
    cart,
    setCart,
    setOrders,
  } = useContext(LocalContext);

  const alert = useAlert();

  const [country, setCountry] = useState(
    currentUser && currentUser.address ? currentUser.address.country : ''
  );
  const [province, setProvince] = useState(
    currentUser && currentUser.address ? currentUser.address.state : ''
  );
  const [city, setCity] = useState(
    currentUser && currentUser.address ? currentUser.address.city : ''
  );
  const [address, setAddress] = useState(
    currentUser && currentUser.address ? currentUser.address.address : ''
  );
  const [postalCode, setPostalCode] = useState(
    currentUser && currentUser.address ? currentUser.address.postal_code : ''
  );
  const [number] = useState(
    currentUser && currentUser.address ? currentUser.address.number : ''
  );

  const [currentScreen, setCurrentScreen] = useState('default');

  const cardUid = cart && cart.length > 0 ? cart.map((p) => p.productID) : [];
  let cartProducts = [];
  products.forEach((p) => {
    if (cardUid.includes(p.productID)) {
      cartProducts.push(p);
    }
  });

  const options = (productID) =>
    Array.from(
      { length: products.find((p) => p.productID === productID).amount },
      (_, i) => (i + 1).toString()
    ).map((e) => {
      return { value: e, label: e };
    });

  const changeQuantity = (newAmount, productID) => {
    setCart((prev) =>
      prev.map((p) => {
        if (p.productID === productID) {
          let update = { ...p };
          update.amount = newAmount;
          return update;
        } else {
          return p;
        }
      })
    );
  };

  const checkUpdateInfo = () => {
    return (
      country.length > 0 &&
      province.length > 0 &&
      city.length > 0 &&
      address.length > 0 &&
      postalCode.length > 0 &&
      number.length > 0
    );
  };

  const updateInfo = () => {
    const data = {
      uid: loggedInUser.uid,
      country: country,
      state: province,
      city: city,
      address: address,
      postal_code: postalCode,
      number: number && number.length > 0 ? number : '+00000',
      preferred_payment: 'PAYPAL',
    };

    axios
      .post(`${APIURL}/api/shop/user/update`, data, {
        headers: { Authorization: `Bearer ${loggedInUser.jwt}` },
      })
      .then((res) => {
        if (res.data.error === 0) {
          setUsers((prev) =>
            prev.map((user) => {
              if (user.uid === loggedInUser.uid) {
                let updatedUser = { ...user };

                user.address = {
                  country: data.country,
                  state: data.state,
                  city: data.city,
                  address: data.address,
                  postal_code: data.postal_code,
                  number: data.number,
                };

                return updatedUser;
              } else {
                return user;
              }
            })
          );

          setCurrentScreen('payment');
        } else {
          console.log(res.data);
        }
      });
  };

  const addOrder = () => {
    let d = new Date();
    const timestamp = new Date(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds()
    );

    const data = {
      uid: loggedInUser.uid,
      orderID: v4(),
      date: timestamp,
      products: [...cart],
      is_paid: { status: true, date: timestamp },
      is_delivered: { status: false, date: timestamp },
      tax_percentage: 1.15,
    };

    axios
      .post(`${APIURL}/api/shop/order/create`, data, {
        headers: { Authorization: `Bearer ${loggedInUser.jwt}` },
      })
      .then((res) => {
        if (res.data.error === 0) {
          setOrders((prev) => [data, ...prev]);

          alert.success('Order Successfully Placed!');

          axios
            .post(
              `${APIURL}/api/shop/order/update`,
              { ...data, isPaid: 'true' },
              {
                headers: { Authorization: `Bearer ${loggedInUser.jwt}` },
              }
            )
            .then((resp) => {
              if (resp.data.error !== 0) {
                console.log(resp.data);
              }
            });

          setProducts((prev) =>
            prev.map((product) => {
              if (cart.map((c) => c.productID).includes(product.productID)) {
                let updatedProduct = { ...product };
                updatedProduct.amount =
                  parseInt(updatedProduct.amount) -
                  parseInt(
                    cart.find((c) => c.productID === updatedProduct.productID)
                      .amount
                  );
                return updatedProduct;
              } else {
                return product;
              }
            })
          );

          setCart({});
          setCurrentScreen('default');

          history.push('/profile');
        } else {
          console.log(res.data);
        }
      });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!loggedInUser.uid || loggedInUser.uid === undefined ? (
        <div
          className={`w-11/12 py-4 bg-red-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75`}
        >
          You need to sign in first to add items to your cart
        </div>
      ) : currentScreen === 'default' ? (
        <div className="w-full flex sm:flex-row flex-col sm:justify-around sm:items-start items-center mt-4">
          <div className="sm:w-2/3 w-11/12 flex flex-col">
            <button
              className="sm:w-1/3 sm:mb-4 uppercase border-gray-800 hover:bg-gray-800 focus:bg-gray-800 border-2 text-gray-800 hover:text-gray-300 focus:text-gray-300 sm:text-lg text-base"
              onClick={() => history.goBack()}
            >
              Go back
            </button>

            <div className="text-gray-800 tracking-wider font-bold sm:text-3xl text-xl sm:mt-0 my-4">
              Shopping Cart
            </div>

            {cartProducts && cartProducts.length > 0 ? (
              cartProducts.map((product, i) => (
                <div
                  className="w-full sm:h-20 flex items-center justify-between py-2 sm:px-4 px-2 bg-gray-200 mb-2"
                  key={`cart-${product.productID}-${i}`}
                >
                  <img
                    src={`${UPLOADSURL}/${product.images[0]}`}
                    alt={`cart-${product.productID}-${i}`}
                    className="h-full w-1/5 object-scale-down"
                  />

                  <button
                    className="text-gray-700 tracking-wide sm:text-base text-xs font-semibold mt-2 w-1/5 underline hover:no-underline focus:no-underline text-left"
                    onClick={() =>
                      history.push(`/product/${product.productID}`)
                    }
                  >
                    {product.name}
                  </button>

                  <div className="text-gray-800 tracking-wide sm:text-base text-xs font-bold mt-2 w-1/5">
                    ${product.price}
                  </div>

                  <div className="w-1/5 s;m:text-sm text-xs">
                    <Select
                      options={options(product.productID)}
                      value={{
                        label: cart
                          .find((p) => p.productID === product.productID)
                          .amount.toString(),
                        value: cart
                          .find((p) => p.productID === product.productID)
                          .amount.toString(),
                      }}
                      onChange={(e) =>
                        changeQuantity(parseInt(e.value), product.productID)
                      }
                    />
                  </div>

                  <button
                    className="ri-delete-bin-line sm:h-10 h-8 sm:w-10 w-8 bg-gray-800 hover:text-red-200 focus:text-red-200 text-red-300"
                    title="Remove from cart"
                    onClick={() =>
                      setCart((prev) =>
                        prev.filter((p) => p.productID !== product.productID)
                      )
                    }
                  ></button>
                </div>
              ))
            ) : (
              <div className="w-full py-4 bg-gray-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75">
                No products added to cart yet.
              </div>
            )}
          </div>

          <div className="sm:w-1/4 w-11/12 flex flex-col my-2 border-2 border-gray-500">
            <div className="w-full text-left mb-2 sm:text-2xl text-lg tracking-wider text-gray-700 font-bold uppercase mt-2 mx-2">
              Subtotal {`(${cartProducts.length})`} items
            </div>
            {cartProducts && cartProducts.length > 0 && (
              <div className="w-full text-left sm:text-base text-sm text-gray-800 border-b-2 border-gray-500 px-2 pb-2">
                $
                {cartProducts
                  .map(
                    (product) =>
                      parseFloat(product.price) *
                      parseFloat(
                        cart.find((c) => c.productID === product.productID)
                          .amount
                      )
                  )
                  .reduce((a, b) => a + b, 0) * 1.15}
              </div>
            )}
            <div className="my-4 flex items-center justify-center">
              <button
                className={`p-2 bg-black border-2 border-black sm:text-lg uppercase text-sm text-gray-200 w-11/12 ${
                  cartProducts && cartProducts.length > 0
                    ? 'hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black'
                    : 'opacity-75'
                }`}
                onClick={() =>
                  cartProducts &&
                  cartProducts.length > 0 &&
                  setCurrentScreen('address')
                }
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      ) : currentScreen === 'address' ? (
        <div className="w-full flex sm:flex-row flex-col sm:justify-around sm:items-start items-center mt-4">
          <div className="sm:w-2/3 w-11/12 flex flex-col">
            <button
              className="sm:w-1/3 sm:mb-4 uppercase border-gray-800 hover:bg-gray-800 focus:bg-gray-800 border-2 text-gray-800 hover:text-gray-300 focus:text-gray-300 sm:text-lg text-base"
              onClick={() => setCurrentScreen('default')}
            >
              Go back
            </button>

            <div className="text-gray-800 tracking-wider font-bold sm:text-3xl text-xl sm:mt-0 mt-4">
              Shipping
            </div>

            <div className="w-full mt-2">
              <div className="text-gray-800 sm:text-base text-sm">Country</div>
              <input
                title="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
              />
            </div>

            <div className="w-full mt-2">
              <div className="text-gray-800 sm:text-base text-sm">
                State / Province
              </div>
              <input
                title="state"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
              />
            </div>

            <div className="w-full mt-2">
              <div className="text-gray-800 sm:text-base text-sm">City</div>
              <input
                title="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
              />
            </div>

            <div className="w-full mt-2">
              <div className="text-gray-800 sm:text-base text-sm">Address</div>
              <input
                title="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
              />
            </div>

            <div className="w-full mt-2">
              <div className="text-gray-800 sm:text-base text-sm">
                Postal Code
              </div>
              <input
                title="postal_code"
                value={postalCode}
                onChange={(e) => {
                  if (
                    (e.target.value.length < 6 &&
                      /^\d+$/.test(e.target.value)) ||
                    e.target.value.length === 0
                  )
                    setPostalCode(e.target.value);
                }}
                className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
              />
            </div>

            <button
              className={`${
                checkUpdateInfo()
                  ? 'hover:bg-gray-800 focus:bg-gray-800'
                  : 'opacity-75'
              } sm:w-1/3 w-full bg-black text-gray-100 mt-4 sm:p-4 p-2 sm:text-lg text-sm`}
              onClick={() =>
                postalCode.length < 5
                  ? alert.error('Postal Code is invalid!')
                  : checkUpdateInfo()
                  ? updateInfo()
                  : alert.error('No fields should be empty!')
              }
            >
              Continue
            </button>
          </div>
        </div>
      ) : currentScreen === 'payment' ? (
        <div className="w-full flex sm:flex-row flex-col sm:justify-around sm:items-start items-center mt-4">
          <div className="sm:w-2/3 w-11/12 flex flex-col">
            <button
              className="sm:w-1/3 sm:mb-4 uppercase border-gray-800 hover:bg-gray-800 focus:bg-gray-800 border-2 text-gray-800 hover:text-gray-300 focus:text-gray-300 sm:text-lg text-base"
              onClick={() => setCurrentScreen('address')}
            >
              Go back
            </button>

            <div className="text-gray-800 tracking-wider font-bold sm:text-3xl text-xl sm:mt-0 mt-4">
              Payment Method
            </div>

            <div className="w-full mt-2">
              <div className="text-gray-800 sm:text-base text-sm">
                Select Method
              </div>
              <div className="w-full mt-1 sm:text-base text-xs text-gray-800 flex items-center">
                <input
                  readOnly
                  title="payment"
                  type="radio"
                  value="PayPal"
                  checked={true}
                  className="mr-2"
                />{' '}
                PayPal
              </div>
            </div>

            <button
              className={`hover:bg-gray-800 focus:bg-gray-800 sm:w-1/3 w-full bg-black text-gray-100 mt-4 sm:p-4 p-2 sm:text-lg text-sm`}
              onClick={() => setCurrentScreen('summary')}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex sm:flex-row flex-col sm:justify-around sm:items-start items-center mt-4">
          <div className="sm:w-2/3 w-11/12 flex flex-col">
            <div className="w-full mt-2">
              <div className="text-gray-800 sm:text-xl text-lg uppercase tracking-wider font-semibold">
                Shipping
              </div>
              <div className="text-gray-700 sm:text-sm text-xs mt-1">
                Name: {currentUser.name}
              </div>
              <div className="text-gray-700 sm:text-sm text-xs mt-1">
                Address:{' '}
                {`${postalCode}, ${address}, ${city}, ${province}, ${country}`}
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
                    cart.find((c) => c.productID === product.productID).amount
                  } x $${product.price} = $${
                    parseFloat(product.price) *
                    parseFloat(
                      cart.find((c) => c.productID === product.productID).amount
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
                          cart.find((c) => c.productID === product.productID)
                            .amount
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
                            cart.find((c) => c.productID === product.productID)
                              .amount
                          )
                      )
                      .reduce((a, b) => a + b, 0) * 0.15
                  : 0}
              </div>
            </div>
            <div className="w-full text-left sm:text-base text-sm text-gray-800 border-b-2 border-gray-500 px-2 py-2 flex">
              <div className="w-1/2">Total</div>
              <div className="w-1/2">
                $
                {cartProducts && cartProducts.length > 0
                  ? cartProducts
                      .map(
                        (product) =>
                          parseFloat(product.price) *
                          parseFloat(
                            cart.find((c) => c.productID === product.productID)
                              .amount
                          )
                      )
                      .reduce((a, b) => a + b, 0) * 1.15
                  : 0}
              </div>
            </div>
            <div className="my-4 flex items-center justify-center">
              <button
                className={`p-2 bg-black border-2 border-black sm:text-lg uppercase text-sm text-gray-200 w-11/12 ${
                  cartProducts && cartProducts.length > 0
                    ? 'hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black'
                    : 'opacity-75'
                }`}
                onClick={() => addOrder()}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
