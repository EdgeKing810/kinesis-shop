<div className="w-full flex flex-col items-center">
  {error && (
    <div
      className={`w-11/12 py-4 bg-${color}-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75`}
    >
      {error}
    </div>
  )}

  {cartProducts && cartProducts.length > 0 && (
    <div className="w-full flex sm:flex-row flex-col sm:justify-around sm:items-start items-center mt-4">
      <div className="sm:w-1/4 w-11/12 flex flex-col">
        <button
          className="sm:w-1/3 mb-4 uppercase border-gray-800 hover:bg-gray-800 focus:bg-gray-800 border-2 text-gray-800 hover:text-gray-300 focus:text-gray-300 sm:text-lg text-base"
          onClick={() => history.goBack()}
        >
          Go back
        </button>

        {cartProducts.map((product, i) => (
          <div
            className="w-full h-full flex items-center justify-center"
            key={`cart-${product.productID}-${i}`}
          >
            <img
              src={`${UPLOADSURL}/${product.images[0]}`}
              alt={`cart-${product.productID}-${i}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="sm:w-1/4 w-11/12 sm:h-40 flex flex-col">
        <div className="bg-gray-300 sm:pt-0 pt-1 sm:mt-0 mt-4"></div>

        <div className="text-gray-800 tracking-wide sm:text-3xl text-xl sm:mt-0 mt-4">
          {cartProducts[0].name}
        </div>

        <div className="bg-gray-300 pt-1 mt-4"></div>
      </div>

      <div className="sm:w-1/4 w-11/12 flex flex-col my-2 border-2 border-gray-500">
        <div className="w-full flex border-b-2 border-gray-500 py-2">
          <div className="sm:w-1/2 w-1/3 font-bold text-gray-700 ml-2">
            Price:
          </div>
          <div className="text-gray-700 mr-2">${cartProducts[0].price}</div>
        </div>

        {cartProducts && cartProducts.length > 0 && (
          <div className="w-full flex items-center border-b-2 border-gray-500 py-2">
            <div className="sm:w-1/2 w-1/3 font-bold text-gray-700 ml-2">
              Quantity:
            </div>
            <div className="text-gray-700 sm:w-1/2 w-2/3 mr-2">
              <Select
                options={options(cartProducts[0].productID)}
                //   onChange={(e) => setAmount(parseInt(e.value))}
              />
            </div>
          </div>
        )}

        {cartProducts && cartProducts.length > 0 && (
          <div className="w-full flex justify-center py-2">
            <button
              className={`p-2 bg-black border-2 border-black sm:text-lg text-sm text-gray-200 w-11/12 ${
                amount > 0
                  ? 'hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black'
                  : 'opacity-75'
              }`}
              //   onClick={() => {
              //     if (amount > 0) {
              //       setCart();
              //       history.push('/cart');
              //     } else {
              //       alert.error('Select a quantity first.');
              //     }
              //   }}
            >
              Add to cart
            </button>
          </div>
        )}
      </div>
    </div>
  )}
</div>;
