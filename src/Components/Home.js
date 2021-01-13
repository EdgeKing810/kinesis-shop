import React, { useContext, useState } from 'react';

import { LocalContext } from '../LocalContext';

export default function Home() {
  const [error, setError] = useState('Loading Products');

  const { products } = useContext(LocalContext);

  useState(() => {
    if (products && products.length > 0) {
      setError('');
      return;
    }

    setTimeout(() => setError('No products yet'), 1000);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <div className="w-11/12 py-4 bg-gray-400 text-gray-700 sm:text-xl text-lg mt-4 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
