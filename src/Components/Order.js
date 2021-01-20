import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

export default function Order() {
  const history = useHistory();

  const { APIURL, UPLOADSURL, loggedInUser, products, orders };

  const { orderID } = useParams();

  return (
    <div className="w-full flex flex-col items-center">
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
    </div>
  );
}
