import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ReactStars from 'react-rating-stars-component';

import { LocalContext } from '../LocalContext';

export default function Search() {
  const { UPLOADSURL, products } = useContext(LocalContext);

  const { searchInput } = useParams();
  const history = useHistory();

  const productsToDisplay = products.filter((product) =>
    product.name.toLowerCase().includes(searchInput.toString())
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-gray-800 tracking-wider font-bold sm:text-3xl text-xl sm:mt-4 my-4 w-11/12 text-left">
        Search Results {`(${productsToDisplay.length})`}
      </div>

      {productsToDisplay && productsToDisplay.length > 0 ? (
        <div className="grid sm:grid-cols-5 grid-cols-1 sm:gap-4 w-11/12 mb-4">
          {productsToDisplay.map((pr, i) => (
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

              <div className="w-full h-1/3 flex flex-col justify-end mt-2 pb-4">
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
                        ? parseInt(
                            pr.reviews
                              .map((r) => parseFloat(r.rating))
                              .reduce((acc, rat) => acc + rat, 0) /
                              pr.reviews.length
                          )
                        : 0
                    }
                    activeColor="#ffd700"
                  />
                  <div className="text-gray-700 text-sm ml-2">
                    {pr.reviews !== undefined ? pr.reviews.length : 0} review
                    {(pr.reviews === undefined || pr.reviews.length !== 1) &&
                      's'}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div
          className={`w-11/12 py-4 bg-red-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75`}
        >
          No products found.
        </div>
      )}
    </div>
  );
}
