import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

import { LocalContext } from '../LocalContext';

export default function Login() {
  const {
    APIURL,
    setLoggedInUser,
    setUsers,
    setProducts,
    setOrders,
  } = useContext(LocalContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [color, setColor] = useState('blue');

  const history = useHistory();

  const submitForm = (e) => {
    e.preventDefault();

    setColor('blue');
    setError('Submitting...');

    const data = {
      username: username,
      password: password,
    };

    axios.post(`${APIURL}/api/user/login`, data).then((res) => {
      if (res.data.error !== 0) {
        setColor('red');
        setError(res.data.message);

        setLoggedInUser(res.data);

        setTimeout(() => {
          setUsername('');
          setPassword('');
          setError('');
        }, 2000);
      } else {
        setColor('green');
        setError('Logging in...');

        localStorage.setItem(
          '_userData',
          JSON.stringify({
            uid: res.data.uid,
            jwt: res.data.jwt,
          })
        );

        setTimeout(() => {
          setUsername('');
          setPassword('');
          setError('');

          history.push('/');

          alert.success('Logged in successfully!');
        }, 1000);

        const data = {
          uid: res.data.uid,
          profileID: res.data.uid,
        };

        axios
          .post(`${APIURL}/api/shop/products`, data, {
            headers: { Authorization: `Bearer ${res.data.jwt}` },
          })
          .then((resp) => {
            if (resp.data.error === 0) {
              setProducts(resp.data.products.reverse());
            }
          });

        axios
          .post(`${APIURL}/api/shop/users`, data, {
            headers: { Authorization: `Bearer ${res.data.jwt}` },
          })
          .then((resp) => {
            if (resp.data.error === 0) {
              setUsers(resp.data.users);
            }
          });

        axios
          .post(`${APIURL}/api/shop/orders`, data, {
            headers: { Authorization: `Bearer ${res.data.jwt}` },
          })
          .then((resp) => {
            if (resp.data.error === 0) {
              setOrders(resp.data.orders.reverse());
            }
          });
      }
    });
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-11/12 flex flex-col">
        <div className="sm:text-3xl text-xl tracking-wide font-bold text-gray-800 w-full text-left mt-4">
          Sign In
        </div>

        {error.length > 0 ? (
          <div
            className={`w-full py-4 bg-${color}-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75`}
          >
            {error}
          </div>
        ) : (
          <form
            className="w-full h-full flex flex-col"
            onSubmit={(e) =>
              username.length > 0 && password.length > 0 ? submitForm(e) : null
            }
          >
            <input
              type="text"
              name="username"
              placeholder="Enter Username..."
              className="p-4 text-gray-600 placeholder-gray-500 sm:text-lg text-sm w-full border-2 border-gray-500 mt-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password..."
              className="p-4 text-gray-600 placeholder-gray-500 sm:text-lg text-sm w-full border-2 border-gray-500 mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <a
              className="font-open sm:text-md text-sm mt-4 text-gray-600 underline hover:no-underline focus:no-underline w-full text-left"
              href="https://connect.kinesis.games"
              target="_blank"
              rel="noopener noreferrer"
            >
              Don't have an account yet?
            </a>

            <button
              type="submit"
              className={`sm:w-1/4 w-full mt-2 p-4 ${
                username.length > 0 && password.length > 0
                  ? 'hover:bg-gray-800 focus:bg-gray-800 hover:text-gray-300 focus:text-gray-300'
                  : 'opacity-75'
              } border-2 border-gray-800 text-gray-800 sm:text-lg text-base`}
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
