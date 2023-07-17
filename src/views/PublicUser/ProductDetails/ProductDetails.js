import React, {useState, useEffect} from 'react';
import axios from 'axios';
import productImage from '../../../assets/img/icon/img.jpg';
import './ProductDetails.css';
import {StorageStrings} from '../../../constance/StorageStrings';
import Cookies from 'js-cookie';
import * as CommonFunc from "../../../utils/CommonFunc";
import {Button, Card, CardText, Col} from "reactstrap";

const ProductDetails = (props) => {
  const [formData, setFormData] = useState({
    qty: 0,
    price: 0,
    country: '',
    deliveryAddress: '',
    expectedDate: '',
  });

  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const productDetails = props.location.state.productItem
    setProductDetails(productDetails)
    setFormData({
      ...formData,
      productId: productDetails.productId
    })
  }, [])


  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (event) => {
    if (event.target.id === 'qty') {
      const val =event.target.value.replace(/[^0-9]*/g,'');
      const price = Number(val) * Number(productDetails.unitPrice);
      setFormData({
        ...formData,
        [event.target.id]: val,
        price,
      })
    }else {
      setFormData({
        ...formData,
        [event.target.id]: event.target.value
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const {qty, price, country, deliveryAddress, expectedDate} = formData;
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
        CommonFunc.notifyMessage('Product request sent successfully', 1);
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
        <h1 className="pt-3 mb-2">Place Your Order</h1>
      </center>
      <Card style={{width: '100%', marginTop: 10}}>
        <div className="pview">
          <div className="row">
            <div className="col-md-6">
              <img
                src={productDetails.image}
                alt="Product Image"
                className="img-fluid"
              />
            </div>
            <div className="col-md-6">
              <div className="product-details">
                <h2 className="product-name">{productDetails.productName}</h2>
                <CardText className="text-black-50 mt-1 pb-2" tag="h6">
                  {productDetails.description}
                </CardText>
                <CardText className="pb-3" tag="h6">{`Rs (Per Unit): ${productDetails.unitPrice}`}</CardText>
              </div>
              <form className="fm" onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <label htmlFor="qty" className="col-sm-4 col-form-label font-weight-bold">
                    Quantity
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="number"
                      className={`form-control ${errors.qty ? 'is-invalid' : ''}`}
                      id="qty"
                      onKeyDown="if(event.key==='.'){event.preventDefault();}"
                      value={formData.qty}
                      onChange={handleInputChange}
                    />
                    {errors.qty && <div className="invalid-feedback">{errors.qty}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="price" className="col-sm-4 col-form-label font-weight-bold">
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
                      disabled={true}
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="country" className="col-sm-4 col-form-label font-weight-bold">
                    Country
                  </label>
                  <div className="col-sm-8">
                    <select
                      className={`form-control ${errors.country ? 'is-invalid' : ''}`}
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
                  <label htmlFor="deliveryAddress" className="col-sm-4 col-form-label font-weight-bold">
                    Delivery Address
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className={`form-control ${errors.deliveryAddress ? 'is-invalid' : ''}`}
                      placeholder={"Enter Delivery Address"}
                      id="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                    />
                    {errors.deliveryAddress && <div className="invalid-feedback">{errors.deliveryAddress}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="expectedDate" className="col-sm-4 col-form-label font-weight-bold">
                    Expected Date
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      className={`form-control ${errors.expectedDate ? 'is-invalid' : ''}`}
                      id="expectedDate"
                      value={formData.expectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={handleInputChange}
                    />
                    {errors.expectedDate && <div className="invalid-feedback">{errors.expectedDate}</div>}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 text-end">
                    <Button type="submit" className="text-center btn btn-success pl-3 pr-3 w-25 mt-2">
                      Request
                    </Button>
                  </div>
                </div>
              </form>
              {/*{successMessage && (*/}
              {/*  <div className="alert alert-success mt-3" role="alert">*/}
              {/*    {successMessage}*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetails;
