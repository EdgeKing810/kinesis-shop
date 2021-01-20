import React, { useContext, useState } from 'react';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';

import axios from 'axios';
import { v4 } from 'uuid';

import { LocalContext } from '../LocalContext';

export default function Profile() {
  const [error, setError] = useState('Fetching product info...');
  const [color, setColor] = useState('blue');

  const [selected, setSelected] = useState('info');

  const [createProduct, setCreateProduct] = useState(false);
  const [editProduct, setEditProduct] = useState('');

  const history = useHistory();

  const {
    APIURL,
    loggedInUser,
    setLoggedInUser,
    products,
    setProducts,
    users,
    setUsers,
    orders,
    setOrders,
    setCart,
  } = useContext(LocalContext);

  const alert = useAlert();

  const currentUser =
    loggedInUser.uid && loggedInUser.uid !== undefined
      ? users.find((u) => u.uid === loggedInUser.uid)
      : {};

  let userProducts = [];

  if (loggedInUser.uid && loggedInUser.uid !== undefined) {
    products.forEach((p) => {
      if (p.uid === loggedInUser.uid) {
        userProducts.push({ ...p });
      }
    });
  }

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

  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [productAmount, setProductAmount] = useState(0);
  const [productDescription, setProductDescription] = useState('');

  const [preferredPayment] = useState(
    currentUser && currentUser.preferred_payment
      ? currentUser.preferred_payment
      : 'PAYPAL'
  );

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

  const signOut = () => {
    setLoggedInUser({});
    setOrders([]);
    setCart([]);
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

          setUsers((prev) =>
            prev.map((user) => {
              if (user.uid === loggedInUser.uid) {
                let updatedUser = { ...user };

                user.address = {
                  country: data.country,
                  state: data.state,
                  city: data.city,
                  address: data.address,
                  postal_code: data.postal_code,
                  number: data.number,
                };

                return updatedUser;
              } else {
                return user;
              }
            })
          );
        } else {
          console.log(res.data);
        }
      });
  };

  const setIsEditingProduct = (productID) => {
    const currentProduct = products.find((p) => p.productID === productID);

    if (!currentProduct) return;

    setEditProduct(productID);

    setProductName(currentProduct.name);
    setProductBrand(currentProduct.brand);
    setProductCategory(currentProduct.category);
    setProductPrice(currentProduct.price);
    setProductImages(currentProduct.images);
    setProductAmount(currentProduct.amount);
    setProductDescription(currentProduct.description);
  };

  const uploadImage = (e) => {
    alert.info(
      'Avoid symbols/spaces in file name. Might take some time to upload.'
    );

    if (e.target.files[0]) {
      if (e.target.files[0].size > 10485760) {
        alert.error('File too large!');
      } else {
        e.preventDefault();

        const data = new FormData();
        data.append('file', e.target.files[0]);

        axios.post(`${APIURL}/api/user/upload`, data).then((res) => {
          setProductImages((prev) =>
            prev.length > 0 ? [...prev, res.data.url] : [res.data.url]
          );

          alert.success('Successfully uploaded!');
        });
      }
    }
  };

  const reset = () => {
    setProductName('');
    setProductBrand('');
    setProductCategory('');
    setProductPrice(0);
    setProductImages([]);
    setProductAmount(0);
    setProductDescription('');
  };

  const checkProductValid = () => {
    return (
      productName.length > 0 &&
      productBrand.length > 0 &&
      productCategory.length > 0 &&
      productPrice.length > 0 &&
      productImages.length > 0 &&
      productAmount.length > 0 &&
      productDescription.length > 0
    );
  };

  const submitProduct = () => {
    const currentProduct =
      editProduct.length > 0
        ? products.find((p) => p.productID === editProduct)
        : null;

    const data = {
      uid: loggedInUser.uid,
      productID: editProduct.length > 0 ? editProduct : v4(),
      name: productName,
      brand: productBrand,
      category: productCategory,
      price: productPrice,
      images: productImages,
      amount: productAmount,
      description: productDescription,
      shipping_cost: parseFloat(productPrice) * 0.05,
      reviews: editProduct ? currentProduct.reviews : [],
    };

    axios
      .post(
        `${APIURL}/api/shop/product/${
          editProduct.length > 0 ? 'edit' : 'create'
        }`,
        { ...data },
        { headers: { Authorization: `Bearer ${loggedInUser.jwt}` } }
      )
      .then((res) => {
        if (res.data.error !== 0) {
          console.log(res.data);
        } else {
          if (editProduct.length > 0) {
            setProducts((prev) =>
              prev.map((p) => {
                if (p.productID === editProduct) {
                  return data;
                } else {
                  return p;
                }
              })
            );
          } else {
            setProducts((prev) =>
              prev.length > 0 ? [{ ...data }, ...prev] : [{ ...data }]
            );
          }

          reset();

          setCreateProduct(false);
          setEditProduct('');

          alert.success(
            `Successfully ${
              editProduct.length > 0 ? 'updated' : 'created'
            } product!`
          );
        }
      });
  };

  const makeAdmin = (userID) => {
    if (
      window.confirm('Are you sure that you want this user to be an admin?')
    ) {
      const data = {
        uid: loggedInUser.uid,
        profileID: userID,
      };

      axios
        .post(
          `${APIURL}/api/shop/user/admin`,
          { ...data },
          { headers: { Authorization: `Bearer ${loggedInUser.jwt}` } }
        )
        .then((res) => {
          if (res.data.error !== 0) {
            console.log(res.data);
          } else {
            setUsers((prev) =>
              prev.map((u) => {
                if (u.uid === userID) {
                  let updatedUser = { ...u };
                  updatedUser.is_admin = true;
                  return updatedUser;
                } else {
                  return u;
                }
              })
            );

            alert.success(`User is now an admin!`);
          }
        });
    }
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
          postalCode.length < 5
            ? alert.error('Postal Code is invalid!')
            : checkUpdateInfo()
            ? updateInfo()
            : alert.error('No fields should be empty!')
        }
      >
        Update
      </button>
    </div>
  );

  const createProductInterface = (
    <div className="w-full p-4 flex flex-col sm:items-start items-center border-2">
      <div className="w-full">
        <div className="text-gray-800 sm:text-base text-sm">Name</div>
        <input
          title="product_name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">Brand</div>
        <input
          title="product_brand"
          value={productBrand}
          onChange={(e) => setProductBrand(e.target.value)}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">Category</div>
        <input
          title="product_category"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">Price (USD)</div>
        <input
          title="product_price"
          value={productPrice}
          onChange={(e) => {
            if (
              /^\d+(,\d{3})*(\.\d{0,2})?$/.test(e.target.value) ||
              e.target.value.length === 0
            ) {
              setProductPrice(e.target.value);
            }
          }}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm mb-1">Images</div>
        {productImages.map((pi, i) => (
          <div
            className="w-full p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900 overflow-hidden flex justify-between"
            key={`product-image-${i}`}
          >
            <span className="w-11/12">{pi.split('/').reverse()[0]}</span>

            <button
              onClick={() =>
                setProductImages((prev) => prev.filter((p) => p !== pi))
              }
              className="ri-close-line w-1/12 flex items-center justify-center text-red-500 bg-gray-400 -m-2 sm:text-lg text-base"
            ></button>
          </div>
        ))}
        <input
          type="file"
          title="product_images"
          id="image"
          name="image"
          accept=".jpg,.jpeg,.png,.svg,.gif,.bmp"
          onChange={(e) => {
            e.persist();
            alert.info('Uploading...');
            uploadImage(e);
          }}
          className="w-full p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">
          Amount in stock
        </div>
        <input
          title="product_amount"
          value={productAmount}
          onChange={(e) => {
            if (/^\d+$/.test(e.target.value) || e.target.value.length === 0) {
              setProductAmount(e.target.value);
            }
          }}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <div className="w-full mt-2">
        <div className="text-gray-800 sm:text-base text-sm">Description</div>
        <textarea
          title="product_description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="w-full mt-1 p-2 sm:text-base text-xs bg-gray-300 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-500 text-gray-900"
        />
      </div>

      <button
        className={`sm:w-1/4 w-full bg-black text-gray-100 sm:p-4 p-2 mt-2 sm:text-lg text-sm ${
          checkProductValid()
            ? 'hover:bg-gray-800 focus:bg-gray-800'
            : 'opacity-75'
        }`}
        onClick={() =>
          checkProductValid()
            ? submitProduct()
            : alert.error('Please fill out all fields.')
        }
      >
        {editProduct.length > 0 ? 'Update' : 'Create'}
      </button>
    </div>
  );

  const productsTable = (
    <div className="w-full p-4 flex flex-col sm:items-start items-center">
      <div className="w-full flex justify-between items-center mb-2">
        <div className="sm:text-3xl text-xl text-gray-900 font-semibold tracking-wide h-full flex items-center">
          Products
        </div>

        <button
          className="bg-black text-gray-100 sm:p-4 p-2 sm:text-lg text-sm hover:bg-gray-800 focus:bg-gray-800"
          onClick={() => {
            if (editProduct.length > 0) {
              setEditProduct('');
            } else {
              setCreateProduct((prev) => !prev);
            }

            reset();
          }}
        >
          {createProduct || editProduct.length > 0
            ? 'Cancel'
            : 'Create Product'}
        </button>
      </div>

      {(userProducts && userProducts.length > 0) ||
      createProduct ||
      editProduct.length > 0 ? (
        createProduct || editProduct.length > 0 ? (
          createProductInterface
        ) : (
          <div className="w-full sm:overflow-x-hidden overflow-x-scroll">
            <table className="table-auto w-full">
              <tbody>
                <tr>
                  <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/4">
                    id
                  </td>
                  <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/3">
                    Name
                  </td>
                  <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/10">
                    Price
                  </td>
                  <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/10">
                    Category
                  </td>
                  <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/10">
                    Brand
                  </td>
                  <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/10"></td>
                </tr>
                {userProducts.map((pr, i) => (
                  <tr key={`pr-table-${i}`}>
                    <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/4">
                      <button
                        className="w-full text-left underline hover:no-underline focus:no-underline"
                        onClick={() => history.push(`/product/${pr.productID}`)}
                      >
                        {pr.productID}
                      </button>
                    </td>
                    <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/3">
                      {pr.name}
                    </td>
                    <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/10">
                      ${pr.price}
                    </td>
                    <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/10">
                      {pr.category}
                    </td>
                    <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/10">
                      {pr.brand}
                    </td>
                    <td className="sm:text-base text-sm p-2 text-gray-800 border w-1/10 flex items-center justify-center">
                      <button
                        className="ri-pencil-line sm:h-8 h-6 sm:w-8 w-6 bg-gray-300 hover:bg-gray-800 focus:bg-gray-800 hover:text-gray-300 focus:text-gray-300"
                        onClick={() => setIsEditingProduct(pr.productID)}
                      ></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="w-full py-4 bg-gray-400 text-gray-900 sm:text-lg text-base text-center opacity-75">
          No products created yet.
        </div>
      )}
    </div>
  );

  const usersTable = (
    <div className="w-full p-4 flex flex-col sm:items-start items-center">
      <div className="w-full flex justify-between items-center mb-2">
        <div className="sm:text-3xl text-xl text-gray-900 font-semibold tracking-wide h-full flex items-center">
          Users
        </div>
      </div>

      {users && users.length > 0 && currentUser.is_admin ? (
        <div className="w-full sm:overflow-x-hidden overflow-x-scroll">
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/4">
                  id
                </td>
                <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/3">
                  Name
                </td>
                <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/10"></td>
              </tr>
              {users
                .filter((u) => u.uid !== loggedInUser.uid)
                .reverse()
                .map((usr, i) => (
                  <tr key={`usr-table-${i}`}>
                    <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/4">
                      {usr.uid}
                    </td>
                    <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/3">
                      {usr.name}
                    </td>

                    <td className="sm:text-base text-sm p-2 text-gray-800 border w-1/10 flex items-center justify-center">
                      {usr.is_admin ? (
                        <div className="w-full h-full text-center font-bold uppercase text-blue-500">
                          User is an admin
                        </div>
                      ) : (
                        <button
                          className="ri-admin-line sm:h-8 h-6 sm:w-8 w-6 bg-gray-300 hover:bg-gray-800 focus:bg-gray-800 hover:text-gray-300 focus:text-gray-300"
                          title="Make user admin"
                          onClick={() => makeAdmin(usr.uid)}
                        ></button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full py-4 bg-gray-400 text-gray-900 sm:text-lg text-base text-center opacity-75">
          No users on the platform yet.
        </div>
      )}
    </div>
  );

  let orderPrices = [];

  orders.forEach((order) => {
    let prices = order.products.map(
      (product) =>
        parseFloat(
          products.find((p) => p.productID === product.productID).price
        ) * product.amount
    );
    let totalPrice = prices.reduce((a, b) => a + b, 0) * order.tax_percentage;
    orderPrices.push(totalPrice);
  });

  const ordersTable = (
    <div className="w-full p-4 flex flex-col sm:items-start items-center">
      <div className="w-full flex justify-between items-center mb-2">
        <div className="sm:text-3xl text-xl text-gray-900 font-semibold tracking-wide h-full flex items-center">
          Orders
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="w-full sm:overflow-x-hidden overflow-x-scroll">
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/4">
                  id
                </td>
                <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/3">
                  Date
                </td>
                <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/10">
                  Paid
                </td>
                <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/10">
                  Delivered
                </td>
                <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/10">
                  Price
                </td>
                <td className="uppercase sm:text-lg text-xs p-2 text-gray-800 border w-1/10"></td>
              </tr>
              {orders.map((or, i) => (
                <tr key={`order-table-${i}`}>
                  <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/4">
                    <button
                      className="w-full text-left underline hover:no-underline focus:no-underline"
                      onClick={() => history.push(`/order/${or.orderID}`)}
                    >
                      {or.orderID}
                    </button>
                  </td>
                  <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/3">
                    {convertDate(or.date).split(' ').slice(0, 5).join(' ')}
                  </td>
                  <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/10 font-bold">
                    {or.is_paid.status ? (
                      <span className="text-green-500">
                        On{' '}
                        {convertDate(or.is_paid.date)
                          .split(' ')
                          .slice(0, 5)
                          .join(' ')}
                      </span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/10 font-bold">
                    {or.is_delivered.status ? (
                      <span className="text-green-500">
                        On{' '}
                        {convertDate(or.is_delivered.date)
                          .split(' ')
                          .slice(0, 5)
                          .join(' ')}
                      </span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="sm:text-sm text-xs p-2 text-gray-800 border w-1/10">
                    ${orderPrices[i]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full py-4 bg-gray-400 text-gray-900 sm:text-lg text-base text-center opacity-75">
          Nothing ordered yet.
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
            {selected === 'info'
              ? userInformation
              : selected === 'products'
              ? productsTable
              : selected === 'orders'
              ? ordersTable
              : usersTable}
          </div>
        </div>
      )}
    </div>
  );
}
