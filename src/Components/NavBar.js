import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { LocalContext } from '../LocalContext';

export default function NavBar() {
  const [search, setSearch] = useState('');

  const { loggedInUser } = useContext(LocalContext);

  const history = useHistory();

  return (
    <div className="w-full sm:px-20 sm:py-8 bg-gray-800 flex sm:flex-row flex-col justify-between items-center">
      <div className="flex sm:flex-row flex-col h-full items-center sm:w-auto w-full">
        <button
          className="uppercase text-gray-300 font-open tracking-wide sm:text-2xl text-xl font-bold sm:mr-8 sm:my-0 my-4"
          onClick={() => history.push('/')}
        >
          Kinesis Shop
        </button>

        <form
          className="sm:h-full flex sm:flex-row flex-col items-center sm:w-auto w-full"
          onSubmit={(e) => {
            e.preventDefault();
            history.push(`/search/${search}`);
          }}
        >
          <input
            title="Search Products"
            className="sm:p-5 p-2 bg-gray-200 sm:h-full mr-2 sm:text-lg text-sm sm:w-auto w-5/6 placeholder-gray-500 text-gray-800"
            placeholder="Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className={`sm:p-4 p-2 sm:w-auto w-2/3 box-content border-2 border-green-300 ${
              search.length > 0
                ? 'hover:bg-green-300 focus:bg-green-300 hover:text-green-900 focus:text-green-900'
                : 'opacity-75'
            } text-green-400 tracking-wide sm:text-lg text-sm sm:mt-0 mt-2`}
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex h-full sm:w-auto w-5/6 items-center sm:justify-auto justify-between sm:my-0 mb-2 mt-4">
        <button
          className="flex items-center font-bold text-gray-300 hover:text-white focus:text-white tracking-wide sm:text-lg uppercase mr-4"
          onClick={() => history.push('/cart')}
        >
          <span className="ri-shopping-cart-2-fill mr-1"></span>
          Cart
        </button>

        <button
          className="flex items-center font-bold text-gray-300 hover:text-white focus:text-white tracking-wide sm:text-lg uppercase"
          onClick={() =>
            loggedInUser.uid && loggedInUser.uid !== undefined
              ? history.push('/profile')
              : history.push('/sign-in')
          }
        >
          <span className="ri-user-3-fill mr-1"></span>
          {loggedInUser.uid && loggedInUser.uid !== undefined
            ? 'User Interface'
            : 'Sign in'}
        </button>
      </div>
    </div>
  );
}
