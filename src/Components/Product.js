import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Slider from 'react-slick';
import Select from 'react-select';
import ReactStars from 'react-rating-stars-component';
import { useAlert } from 'react-alert';

import { LocalContext } from '../LocalContext';

export default function Product() {
  const [error, setError] = useState('Fetching product info...');
  const [color, setColor] = useState('blue');

  const [limit, setLimit] = useState(3);
  const [amount, setAmount] = useState(0);

  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const history = useHistory();
  const { productID } = useParams();

  const alert = useAlert();

  const {
    UPLOADSURL,
    loggedInUser,
    products,
    users,
    cart,
    setCart,
    settings,
  } = useContext(LocalContext);

  const currentProduct = productID
    ? products.find((p) => p.productID.toString() === productID.toString())
    : undefined;

  useState(() => {
    if (
      (products && products.length > 0) ||
      (currentProduct && currentProduct !== undefined)
    ) {
      setError('');
      return;
    }

    setTimeout(() => {
      setError('Product not found');
      setColor('red');
    }, 1000);
    // eslint-disable-next-line
  }, []);

  const options = Array.from({ length: currentProduct.amount }, (_, i) =>
    (i + 1).toString()
  ).map((e) => {
    return { value: e, label: e };
  });

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

  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <div
          className={`w-11/12 py-4 bg-${color}-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75`}
        >
          {error}
        </div>
      )}

      {currentProduct &&
        currentProduct.images &&
        currentProduct.images.length > 0 && (
          <div className="w-full flex sm:flex-row flex-col sm:justify-around sm:items-start items-center mt-4">
            <div className="sm:w-1/4 w-11/12 flex flex-col">
              <button
                className="sm:w-1/3 mb-4 uppercase border-gray-800 hover:bg-gray-800 focus:bg-gray-800 border-2 text-gray-800 hover:text-gray-300 focus:text-gray-300 sm:text-lg text-base"
                onClick={() => history.goBack()}
              >
                Go back
              </button>

              <Slider {...settings}>
                {currentProduct.images.map((img, i) => (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    key={`slider-${productID}-${i}`}
                  >
                    <img
                      src={`${UPLOADSURL}/${img}`}
                      alt={`slider-${productID}-${i}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </Slider>

              <div className="w-11/12 text-left uppercase sm:text-2xl text-lg text-gray-800 tracking-wide font-bold sm:mt-8 mt-2">
                Reviews{' '}
                {`(${
                  currentProduct.reviews ? currentProduct.reviews.length : 0
                })`}
              </div>

              {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
                <div className="w-full flex flex-col mt-2">
                  {currentProduct.reviews.slice(0, limit).map((review, i) => (
                    <div
                      className="w-full flex flex-col"
                      key={`review-${review.reviewID}`}
                    >
                      <div className="w-full sm:text-base text-sm">
                        {users &&
                          users.length > 0 &&
                          users.find((u) => u.uid === review.uid) &&
                          users.find((u) => u.uid === review.uid).name}
                      </div>

                      <div className="w-full sm:text-sm text-xs">
                        Posted on{' '}
                        {convertDate(review.date)
                          .split(' ')
                          .slice(0, 4)
                          .join(' ')}
                      </div>

                      <div className="w-full flex items-center">
                        <ReactStars
                          count={5}
                          size={24}
                          edit={false}
                          value={parseFloat(review.rating)}
                          activeColor="#ffd700"
                        />
                      </div>

                      <div className="w-full sm:text-sm text-xs">
                        {review.review}
                      </div>

                      {i < currentProduct.reviews.length - 1 && (
                        <div className="bg-gray-300 pt-1 my-2"></div>
                      )}
                    </div>
                  ))}

                  {limit < currentProduct.reviews.length && (
                    <div className="w-full flex justify-end mb-4">
                      <button
                        className="sm:text-lg text-base text-gray-700 hover:no-underline focus:no-underline font-bold underline"
                        onClick={() => setLimit((prev) => prev + 3)}
                      >
                        Show more reviews
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-2 bg-blue-300 text-gray-900 sm:text-lg text-base mt-4 text-center opacity-75">
                  No reviews yet
                </div>
              )}

              <div className="w-11/12 text-left uppercase sm:text-2xl text-lg text-gray-800 tracking-wide font-bold sm:mt-8 mt-4">
                Write a customer review
              </div>

              {loggedInUser.uid && loggedInUser.uidyy !== undefined ? (
                <div className="w-full flex flex-col">
                  <div className="w-full text-left sm:text-lg text-base text-gray-600 tracking-wide font-bold mt-2">
                    Rating
                  </div>
                  <div className="w-full flex items-center">
                    <ReactStars
                      count={5}
                      size={24}
                      edit={true}
                      value={rating}
                      onChange={(e) => setRating(e)}
                      activeColor="#ffd700"
                    />
                  </div>

                  <div className="w-full text-left sm:text-lg text-base text-gray-600 tracking-wide font-bold mt-4">
                    Comment
                  </div>
                  <textarea
                    title="review"
                    className="border-2 border-gray-300 p-2 placeholder-gray-500 text-gray-700 sm:text-sm text-xs mt-2"
                    style={{ minHeight: '5em' }}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />

                  <button
                    className={`sm:w-1/3 sm:mb-8 sm:mt-0 mt-2 uppercase border-gray-800 ${
                      review.length > 0
                        ? 'hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-800 focus:text-gray-800'
                        : 'opacity-50'
                    } border-2 border-gray-800 text-gray-300 bg-gray-800 sm:text-lg text-base p-2`}
                    onClick={() => {
                      if (review.length > 0) console.log('Submit Review');
                    }}
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div className="py-2 bg-blue-300 text-gray-900 sm:text-lg text-base mt-4 text-center opacity-75">
                  Please sign it to write a review
                </div>
              )}
            </div>

            <div className="sm:w-1/4 w-11/12 sm:h-40 flex flex-col">
              <div className="bg-gray-300 sm:pt-0 pt-1 sm:mt-0 mt-4"></div>

              <div className="text-gray-800 tracking-wide sm:text-3xl text-xl sm:mt-0 mt-4">
                {currentProduct.name}
              </div>

              <div className="bg-gray-300 pt-1 mt-4"></div>

              <div className="w-full flex items-center my-2">
                <ReactStars
                  count={5}
                  size={24}
                  edit={false}
                  value={
                    currentProduct.reviews &&
                    currentProduct.reviews !== undefined
                      ? currentProduct.reviews
                          .map((r) => r.rating)
                          .reduce((acc, rat) => acc + rat, 0) /
                        currentProduct.reviews.length
                      : 0
                  }
                  activeColor="#ffd700"
                />
                <div className="text-gray-700 text-sm ml-2">
                  {currentProduct.reviews !== undefined
                    ? currentProduct.reviews.length
                    : 0}{' '}
                  review
                  {(currentProduct.reviews === undefined ||
                    currentProduct.reviews.length !== 1) &&
                    's'}
                </div>
              </div>

              <div className="bg-gray-300 pt-1"></div>

              <div className="text-gray-700 tracking-wide sm:text-lg text-base font-bold my-2">
                Price: ${currentProduct.price}
              </div>

              <div className="bg-gray-300 pt-1"></div>

              <div className="text-gray-700 tracking-wide sm:text-base text-sm font-bold my-2">
                Category: {currentProduct.category}
              </div>

              <div className="bg-gray-300 pt-1"></div>

              <div className="text-gray-700 tracking-wide sm:text-sm text-xs mt-2">
                {currentProduct.description}
              </div>
            </div>

            <div className="sm:w-1/4 w-11/12 flex flex-col my-2 border-2 border-gray-500">
              <div className="w-full flex border-b-2 border-gray-500 py-2">
                <div className="sm:w-1/2 w-1/3 font-bold text-gray-700 ml-2">
                  Price:
                </div>
                <div className="text-gray-700 mr-2">
                  ${currentProduct.price}
                </div>
              </div>

              <div
                className={`w-full flex ${
                  currentProduct.amount &&
                  currentProduct.amount > 0 &&
                  'border-b-2 border-gray-500'
                } py-2`}
              >
                <div className="sm:w-1/2 w-1/3 font-bold text-gray-700 ml-2">
                  Status:
                </div>
                <div className="text-gray-700 mr-2">
                  {currentProduct.amount > 0 ? 'In' : 'Out of'} Stock
                </div>
              </div>

              {currentProduct.amount && currentProduct.amount > 0 && (
                <div className="w-full flex items-center border-b-2 border-gray-500 py-2">
                  <div className="sm:w-1/2 w-1/3 font-bold text-gray-700 ml-2">
                    Quantity:
                  </div>
                  <div className="text-gray-700 sm:w-1/2 w-2/3 mr-2">
                    <Select
                      options={options}
                      onChange={(e) => setAmount(parseInt(e.value))}
                    />
                  </div>
                </div>
              )}

              {currentProduct.amount && currentProduct.amount > 0 && (
                <div className="w-full flex justify-center py-2">
                  {loggedInUser.uid && loggedInUser.uid !== undefined ? (
                    <button
                      className={`p-2 bg-black border-2 border-black sm:text-lg text-sm text-gray-200 w-11/12 ${
                        amount > 0
                          ? 'hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black'
                          : 'opacity-75'
                      }`}
                      onClick={() => {
                        if (amount > 0) {
                          setCart((prev) => {
                            if (
                              prev
                                .map((p) => p.productID)
                                .includes(currentProduct.productID)
                            ) {
                              return prev.map((p) => {
                                if (p.productID === currentProduct.productID) {
                                  return {
                                    uid: currentProduct.uid,
                                    productID: currentProduct.productID,
                                    amount: amount,
                                  };
                                } else {
                                  return p;
                                }
                              });
                            } else {
                              return [
                                ...prev,
                                {
                                  uid: currentProduct.uid,
                                  productID: currentProduct.productID,
                                  amount: amount,
                                },
                              ];
                            }
                          });
                          history.push('/cart');
                        } else {
                          alert.error('Select a quantity first.');
                        }
                      }}
                    >
                      Add to cart
                    </button>
                  ) : (
                    <button
                      className={`p-2 border-2 border-red-300 sm:text-lg text-sm text-gray-800 w-11/12 bg-red-300`}
                      onClick={() => {
                        history.push('/sign-in');
                      }}
                    >
                      Sign in first
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
