import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Slider from 'react-slick';

import { LocalContext } from '../LocalContext';

export default function Home() {
  const [error, setError] = useState('Loading Products...');
  const [color, setColor] = useState('blue');

  const history = useHistory();

  const { UPLOADSURL, settings } = useContext(LocalContext);

  const products = [
    {
      productID: 1,
      name: 'product-1',
      images: [
        'uploads/2021/1/4/11/56/20/ecdeade0-3b09-4149-8f45-a9296b9a4a01/cleanbanner.png',
      ],
    },
    { productID: 2, name: 'product-2', images: [] },
    {
      productID: 3,
      name: 'product-3',
      images: [
        'uploads/2021/1/4/11/44/56/8d6df1e9-e89f-4769-8c4d-fe523f3776ef/banner.png',
      ],
    },
  ];

  useState(() => {
    if (products && products.length > 0) {
      setError('');
      return;
    }

    setTimeout(() => {
      setError('No products yet');
      setColor('red');
    }, 1000);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <div
          className={`w-11/12 py-4 bg-${color}-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75`}
        >
          {error}
        </div>
      )}

      <div className="w-full flex justify-center mt-4">
        <div className="w-11/12 mb-2">
          <Slider {...settings}>
            {products.slice(0, 5).map((pr, i) => (
              <button
                onClick={() => history.push(`/products/${pr.productID}`)}
                key={`carousel-${pr.productID}`}
                className="sm:h-100 h-60 w-full flex justify-center items-center p-2 bg-gray-800"
              >
                <div className="w-full h-1/6 sm:text-2xl text-lg font-bold text-gray-200 text-center mt-2">
                  {pr.name}
                </div>

                <div className="w-full h-5/6 flex justify-center items-start mb-4">
                  <div className="sm:w-1/3 w-4/5">
                    <img
                      src={`${UPLOADSURL}/${pr.images[0]}`}
                      alt={`slider-${i}`}
                      key={`slider-${i}`}
                      className="h-full w-full object-scale-down rounded-lg"
                    />
                  </div>
                </div>
              </button>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
