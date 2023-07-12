import React, { useState } from 'react';
import axios from 'axios';
import productImage from '../../../assets/img/icon/img.jpg';
import './ProductDetails.css';
import { StorageStrings } from '../../../constance/StorageStrings';
import Cookies from 'js-cookie';

const ProductDetails = () => {
  const [formData, setFormData] = useState({
    qty: 0,
    price: 0,
    country: '',
    deliveryAddress: '',
    expectedDate: ''
  });   
  

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { qty, price, country, deliveryAddress, expectedDate } = formData;
    const newErrors = {};

    if (qty === 0 || isNaN(qty)) {
      newErrors.qty = 'Please enter a valid quantity.';
    }

    if (price === 0 || isNaN(price)) {
      newErrors.price = 'Please enter a valid price.';
    }

    if (country === '') {
      newErrors.country = 'Please select a country.';
    }

    if (deliveryAddress === '') {
      newErrors.deliveryAddress = 'Please enter a delivery address.';
    }

    if (expectedDate === '') {
      newErrors.expectedDate = 'Please enter an expected date.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const accessToken =
      localStorage.getItem(StorageStrings.ACCESS_TOKEN) ||
      Cookies.get(StorageStrings.ACCESS_TOKEN);

    axios
      .post('http://localhost:8080/api/v1/orders/place', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        setSuccessMessage('Request sent successfully.');
        setFormData({
          qty: 0,
          price: 0,
          country: '',
          deliveryAddress: '',
          expectedDate: ''
        });
        setErrors({});
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container">
      <center>
        <h1>Place Your Order</h1>
      </center>
      <div className="pview">
        <div className="row">
          <div className="col-md-6">
            <img
              src={
                'https://c8.alamy.com/comp/2CBHG1K/red-chilli-powder-with-dried-red-chillies-in-earthen-bowl-2CBHG1K.jpg'
              }
              alt="Product Image"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6">
            <div className="product-details">
              <h2 className="product-name">Chilli Powder</h2>
              <p className="unit-price">
                Chili powder is a red-colored blend of powdered spices. While it contains some cayenne pepper for heat, it
                also has spices such as cumin, garlic powder, oregano, and paprika intended to lend the flavors expected in
                chili con carne. The ratio is one part cayenne to seven parts other spices, depending on the blend.
              </p>
              <p className="unit-price">RS(Per Unit): 21999.99</p>
            </div>
            <form className="fm" onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label htmlFor="qty" className="col-sm-4 col-form-label">
                  Quantity
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    className={`form-control ${errors.qty ? 'is-invalid' : ''}`}
                    id="qty"
                    value={formData.qty}
                    onChange={handleInputChange}
                  />
                  {errors.qty && <div className="invalid-feedback">{errors.qty}</div>}
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="price" className="col-sm-4 col-form-label">
                  Price
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="country" className="col-sm-4 col-form-label">
                  Country
                </label>
                <div className="col-sm-8">
                  <select
                    className={`form-select ${errors.country ? 'is-invalid' : ''}`}
                    id="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a country</option>
                    <option value="sl">Sri Lanka</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                  </select>
                  {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="deliveryAddress" className="col-sm-4 col-form-label">
                  Delivery Address
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={`form-control ${errors.deliveryAddress ? 'is-invalid' : ''}`}
                    id="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                  />
                  {errors.deliveryAddress && <div className="invalid-feedback">{errors.deliveryAddress}</div>}
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="expectedDate" className="col-sm-4 col-form-label">
                  Expected Date
                </label>
                <div className="col-sm-8">
                  <input
                    type="date"
                    className={`form-control ${errors.expectedDate ? 'is-invalid' : ''}`}
                    id="expectedDate"
                    value={formData.expectedDate}
                    onChange={handleInputChange}
                  />
                  {errors.expectedDate && <div className="invalid-feedback">{errors.expectedDate}</div>}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 text-end">
                  <button type="submit" className="btn btn-primary">
                    Request
                  </button>
                </div>
              </div>
            </form>
            {successMessage && (
              <div className="alert alert-success mt-3" role="alert">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
