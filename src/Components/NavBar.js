import React, { useState } from 'react';

export default function NavBar() {
  const [search, setSearch] = useState('');

  return (
    <div className="w-full sm:px-20 sm:py-8 bg-gray-800 flex sm:flex-row flex-col justify-between items-center">
      <div className="flex sm:flex-row flex-col h-full items-center sm:w-auto w-full">
        <div className="uppercase text-gray-300 font-open tracking-wide sm:text-2xl text-xl font-bold sm:mr-8 sm:my-0 my-4">
          Kinesis Shop
        </div>

        <div className="sm:h-full flex sm:flex-row flex-col items-center sm:w-auto w-full">
          <input
            title="Search Products"
            className="sm:p-5 p-2 bg-gray-200 sm:h-full mr-2 sm:text-lg text-sm sm:w-auto w-5/6 placeholder-gray-500 text-gray-800"
            placeholder="Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className={`sm:px-2 sm:py-4 p-2 sm:w-auto w-2/3 box-content border-2 border-green-300 ${
              search.length > 0
                ? 'hover:bg-green-300 focus:bg-green-300 hover:text-green-900 focus:text-green-900'
                : 'opacity-75'
            } text-green-400 tracking-wide sm:text-lg text-sm sm:mt-0 mt-2`}
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex h-full sm:w-auto w-5/6 items-center sm:justify-auto justify-between sm:my-0 mb-2 mt-4">
        <button className="flex items-center font-bold text-gray-300 hover:text-green-300 focus:text-green-300 tracking-wide sm:text-lg uppercase mr-4">
          <span className="ri-shopping-cart-2-fill mr-1"></span>
          Cart
        </button>

        <button className="flex items-center font-bold text-gray-300 hover:text-green-300 focus:text-green-300 tracking-wide sm:text-lg uppercase">
          <span className="ri-user-3-fill mr-1"></span>
          Sign in
        </button>
      </div>
    </div>
  );
}
