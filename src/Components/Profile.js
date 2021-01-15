import React, { useContext, useState } from 'react';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

import { LocalContext } from '../LocalContext';

export default function Profile() {
  const [error, setError] = useState('Fetching product info...');
  const [color, setColor] = useState('blue');

  const [selected, setSelected] = useState('info');

  const history = useHistory();

  const {
    APIURL,
    loggedInUser,
    setLoggedInUser,
    products,
    users,
    setOrders,
  } = useContext(LocalContext);

  const alert = useAlert();

  const currentUser =
    loggedInUser.uid && loggedInUser.uid !== undefined
      ? users.find((u) => u.uid === loggedInUser.uid)
      : {};

  const [country, setCountry] = useState(
    currentUser && currentUser.address ? currentUser.address.country : ''
  );
  const [province, setProvince] = useState(
    currentUser && currentUser.address ? currentUser.address.state : ''
  );
  const [city, setCity] = useState(
    currentUser && currentUser.address ? currentUser.address.city : ''
  );
  const [address, setAddress] = useState(
    currentUser && currentUser.address ? currentUser.address.address : ''
  );
  const [postalCode, setPostalCode] = useState(
    currentUser && currentUser.address ? currentUser.address.postal_code : ''
  );
  const [number, setNumber] = useState(
    currentUser && currentUser.address ? currentUser.address.number : ''
  );

  const [preferredPayment] = useState(
    currentUser && currentUser.preferred_payment
      ? currentUser.preferred_payment
      : 'PAYPAL'
  );

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

  const checkUpdateInfo = () => {
    return (
      country.length > 0 &&
      province.length > 0 &&
      city.length > 0 &&
      address.length > 0 &&
      postalCode.length > 0 &&
      number.length > 0
    );
  };

  const updateInfo = () => {
    const data = {
      uid: loggedInUser.uid,
      country: country,
      state: province,
      city: city,
      address: address,
      postal_code: postalCode,
      number: number,
      preferred_payment: preferredPayment,
    };

    axios
      .post(`${APIURL}/api/shop/user/update`, data, {
        headers: { Authorization: `Bearer ${loggedInUser.jwt}` },
      })
      .then((res) => {
        if (res.data.error === 0) {
          alert.success('Successfully Updated!');
        } else {
          console.log(res.data);
        }
      });
  };

  const userInformation = (
    <div className="w-full p-4 flex flex-col sm:items-start items-center">
      <div className="sm:text-3xl text-xl text-gray-900 font-semibold tracking-wide">
        Edit information
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">Country</div>
        <input
          title="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">
          State / Province
        </div>
        <input
          title="state"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">City</div>
        <input
          title="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">Address</div>
        <input
          title="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">Postal Code</div>
        <input
          title="postal_code"
          value={postalCode}
          onChange={(e) => {
            if (
              (e.target.value.length < 6 && /^\d+$/.test(e.target.value)) ||
              e.target.value.length === 0
            )
              setPostalCode(e.target.value);
          }}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">
          Telephone / Mobile Number (include country code)
        </div>
        <input
          title="number"
          value={number}
          onChange={(e) => {
            if (
              /^[+\d](?:.*\d)?$/.test(e.target.value) ||
              e.target.value.length === 0
            )
              setNumber(e.target.value);
          }}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <button
        className={`${
          checkUpdateInfo()
            ? 'hover:bg-gray-800 focus:bg-gray-800'
            : 'opacity-75'
        } sm:w-1/3 w-5/6 bg-black text-gray-100 sm:mt-4 mt-2 sm:p-4 p-2 sm:text-lg text-sm`}
        onClick={() =>
          checkUpdateInfo()
            ? updateInfo()
            : postalCode.length < 5
            ? alert.error('Postal Code is invalid!')
            : alert.error('No fields should be empty!')
        }
      >
        Update
      </button>
    </div>
  );

  const productsTable = (
    <div className="w-full p-4 flex flex-col sm:items-start items-center">
      <div className="sm:text-3xl text-xl text-gray-900 font-semibold tracking-wide">
        Products
      </div>

      {products && products.length > 0 ? (
        <table className="table-fixed w-full">
          <tbody>
            <tr>
              <td className="uppercase p-2 text-gray-800 border w-1/4">id</td>
              <td className="uppercase p-2 text-gray-800 border w-1/3">Name</td>
              <td className="uppercase p-2 text-gray-800 border w-1/10">
                Price
              </td>
              <td className="uppercase p-2 text-gray-800 border w-1/10">
                Category
              </td>
              <td className="uppercase p-2 text-gray-800 border w-1/10">
                Brand
              </td>
              <td className="uppercase p-2 text-gray-800 border w-1/10"></td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="w-full py-4 bg-gray-400 text-gray-900 sm:text-lg text-base text-center opacity-75">
          No products created yet.
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      {error ? (
        <div
          className={`w-11/12 py-4 bg-${color}-400 text-gray-900 sm:text-xl text-lg mt-4 text-center opacity-75`}
        >
          {error}
        </div>
      ) : (
        <div className="w-11/12 flex sm:flex-row flex-col sm:justify-between sm:mt-4 mt-2 py-2">
          <div className="sm:w-1/6 w-full h-full flex flex-col items-center ">
            <div className="border-2 border-gray-500 flex flex-col items-center w-full">
              <button
                className={`sm:w-full w-full sm:py-4 py-2 text-gray-700 ${
                  selected === 'info'
                    ? 'bg-blue-300'
                    : 'hover:bg-blue-200 focus:bg-blue-200'
                } text-base border-b-2 border-gray-500`}
                onClick={() => setSelected('info')}
              >
                User information
              </button>

              <button
                className={`sm:w-full w-full sm:py-4 py-2 text-gray-700 ${
                  selected === 'products'
                    ? 'bg-blue-300'
                    : 'hover:bg-blue-200 focus:bg-blue-200'
                } text-base border-b-2 border-gray-500`}
                onClick={() => setSelected('products')}
              >
                Products
              </button>

              <button
                className={`sm:w-full w-full sm:py-4 py-2 text-gray-700 ${
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
                  className={`sm:w-full w-full sm:py-4 py-2 text-gray-700 ${
                    selected === 'users'
                      ? 'bg-blue-300'
                      : 'hover:bg-blue-200 focus:bg-blue-200'
                  } text-base`}
                  onClick={() => setSelected('users')}
                >
                  Users
                </button>
              )}
            </div>

            <button
              className="sm:w-2/3 w-4/5 uppercase border-red-500 hover:bg-red-500 focus:bg-red-500 border-2 text-gray-800 hover:text-gray-300 focus:text-gray-300 sm:text-lg text-base py-2 sm:my-4 mt-4 mb-2"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>

          <div className="sm:w-4/5 w-full flex flex-col items-center border-2 border-gray-500 sm:mt-0 mt-2">
            {selected === 'info' ? userInformation : productsTable}
          </div>
        </div>
      )}
    </div>
  );
}
