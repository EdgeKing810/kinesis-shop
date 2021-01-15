import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { LocalContext } from '../LocalContext';

export default function Profile() {
  const [error, setError] = useState('Fetching product info...');
  const [color, setColor] = useState('blue');

  const [selected, setSelected] = useState('info');

  const history = useHistory();

  const { loggedInUser, setLoggedInUser, users, setOrders } = useContext(
    LocalContext
  );

  const currentUser =
    loggedInUser.uid && loggedInUser.uid !== undefined
      ? users.find((u) => u.uid === loggedInUser.uid)
      : {};

  useState(() => {
    if (currentUser && currentUser.name) {
      setError('');
      return;
    } else {
      setError('You need to login first.');
      setColor('red');

      setTimeout(() => {
        history.push('/sign-in');
      }, 1000);
    }
    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line
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

  const signOut = () => {
    setLoggedInUser({});
    setOrders([]);
    localStorage.clear();
    history.push('/');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {error ? (
        <div
          className={`w-11/12 py-4 bg-${color}-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75`}
        >
          {error}
        </div>
      ) : (
        <div className="w-11/12 flex sm:flex-row flex-col sm:justify-between mt-4 py-2">
          <div className="sm:w-1/6 w-full flex flex-col items-center border-2 border-gray-500">
            <button
              className={`sm:w-full w-full py-2 text-gray-700 ${
                selected === 'info'
                  ? 'bg-blue-300'
                  : 'hover:bg-blue-200 focus:bg-blue-200'
              } text-base border-b-2 border-gray-500`}
              onClick={() => setSelected('info')}
            >
              User information
            </button>

            <button
              className={`sm:w-full w-full py-2 text-gray-700 ${
                selected === 'products'
                  ? 'bg-blue-300'
                  : 'hover:bg-blue-200 focus:bg-blue-200'
              } text-base border-b-2 border-gray-500`}
              onClick={() => setSelected('products')}
            >
              Products
            </button>

            <button
              className={`sm:w-full w-full py-2 text-gray-700 ${
                selected === 'orders'
                  ? 'bg-blue-300'
                  : 'hover:bg-blue-200 focus:bg-blue-200'
              } text-base border-b-2 border-gray-500`}
              onClick={() => setSelected('orders')}
            >
              Orders
            </button>

            {currentUser.is_admin && (
              <button
                className={`sm:w-full w-full py-2 text-gray-700 ${
                  selected === 'users'
                    ? 'bg-blue-300'
                    : 'hover:bg-blue-200 focus:bg-blue-200'
                } text-base border-b-2 border-gray-500`}
                onClick={() => setSelected('users')}
              >
                Users
              </button>
            )}

            <button
              className="sm:w-2/3 w-4/5 uppercase border-red-500 hover:bg-red-500 focus:bg-red-500 border-2 text-gray-800 hover:text-gray-300 focus:text-gray-300 sm:text-lg text-base py-2 my-2"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
