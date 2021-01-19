import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Select from 'react-select';

import { LocalContext } from '../LocalContext';

export default function Product() {
  const history = useHistory();

  const { UPLOADSURL, loggedInUser, products, cart, setCart } = useContext(
    LocalContext
  );

  const [currentScreen, setCurrentScreen] = useState('default');

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

  const cardUid = cart.map((p) => p.productID);
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
            <div className="w-full text-left sm:text-base text-sm text-gray-800 border-b-2 border-gray-500 px-2 pb-2">
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
            <div className="my-4 flex items-center justify-center">
              <button
                className={`p-2 bg-black border-2 border-black sm:text-lg uppercase text-sm text-gray-200 w-11/12 ${
                  cartProducts && cartProducts.length > 0
                    ? 'hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black'
                    : 'opacity-75'
                }`}
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
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
            <div className="w-full text-left sm:text-base text-sm text-gray-800 border-b-2 border-gray-500 px-2 pb-2">
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
            <div className="my-4 flex items-center justify-center">
              <button
                className={`p-2 bg-black border-2 border-black sm:text-lg uppercase text-sm text-gray-200 w-11/12 ${
                  cartProducts && cartProducts.length > 0
                    ? 'hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black'
                    : 'opacity-75'
                }`}
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
