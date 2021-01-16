import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Slider from 'react-slick';
import ReactStars from 'react-rating-stars-component';

import { LocalContext } from '../LocalContext';

export default function Home() {
  const [error, setError] = useState('Loading Products...');
  const [color, setColor] = useState('blue');

  const [limit, setLimit] = useState(10);

  const history = useHistory();

  const { UPLOADSURL, products, settings } = useContext(LocalContext);

  useState(() => {
    setTimeout(() => {
      setError('No products yet.');
      setColor('red');
    }, 1000);

    // eslint-disable-next-line
  }, [products]);

  return (
    <div className="w-full flex flex-col items-center">
      {error && (!products || products.length === 0) && (
        <div
          className={`w-11/12 py-4 bg-${color}-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75`}
        >
          {error}
        </div>
      )}

      {products && products.length > 0 && (
        <div className="w-full flex flex-col items-center mt-4">
          <div className="w-11/12 mb-2">
            <Slider {...settings}>
              {products.slice(0, 5).map((pr, i) => (
                <button
                  onClick={() => history.push(`/products/${pr.productID}`)}
                  key={`carousel-${pr.productID}`}
                  className="sm:h-100 h-60 w-full flex justify-center items-center pb-4 bg-gray-800"
                >
                  <div className="w-full h-1/6 sm:text-2xl text-lg font-bold text-gray-200 text-center mt-2">
                    {pr.name}
                  </div>

                  <div className="w-full h-2/3 flex justify-center items-start mb-4">
                    <div className="sm:w-1/3 w-4/5 h-full">
                      <img
                        src={`${UPLOADSURL}/${pr.images[0]}`}
                        alt={`slider-${i}`}
                        key={`slider-${i}`}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </Slider>
          </div>

          {products && products.length > 0 && (
            <div className="w-11/12 text-left uppercase sm:text-3xl text-xl text-gray-800 tracking-wide font-bold mt-2">
              Latest Products
            </div>
          )}
          {/* <div className="w-11/12 mt-2 flex sm:flex-wrap sm:flex-row flex-col justify-between supergrid items-center"> */}
          {products && products.length > 0 && (
            <div className="grid sm:grid-cols-5 grid-cols-1 sm:gap-4 w-11/12 mb-4">
              {products.slice(0, limit).map((pr, i) => (
                <button
                  className="sm:h-80 h-56 m-1 border-2 border-gray-400 p-2 hover:border-green-300 focus:border-green-300"
                  key={`card-${i}`}
                  onClick={() => history.push(`/product/${pr.productID}`)}
                >
                  <div className="w-full h-2/3 flex items-center justify-center">
                    <img
                      src={`${UPLOADSURL}/${pr.images[0]}`}
                      alt={`card-${i}`}
                      key={`card-${i}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="w-full h-1/3 flex flex-col justify-between mt-2">
                    <div className="w-full text-left font-bold text-base text-gray-700 tracking-wide">
                      {pr.name}
                    </div>

                    <div className="w-full flex items-center">
                      <ReactStars
                        count={5}
                        size={24}
                        edit={false}
                        value={
                          pr.reviews && pr.reviews !== undefined
                            ? pr.reviews
                                .map((r) => parseFloat(r.rating))
                                .reduce((acc, rat) => acc + rat, 0) /
                              pr.reviews.length
                            : 0
                        }
                        activeColor="#ffd700"
                      />
                      <div className="text-gray-700 text-sm ml-2">
                        {pr.reviews !== undefined ? pr.reviews.length : 0}{' '}
                        review
                        {(pr.reviews === undefined ||
                          pr.reviews.length !== 1) &&
                          's'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {limit < products.length && (
            <div className="w-11/12 flex justify-end mb-4">
              <button
                className="sm:text-xl text-lg text-gray-700 :no-underline focus:no-underline font-bold underline"
                onClick={() => setLimit((prev) => prev + 5)}
              >
                Show more
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
