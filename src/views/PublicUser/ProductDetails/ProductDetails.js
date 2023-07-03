
import React from 'react';
import productImage from '../../../assets/img/icon/img.jpg';
import './ProductDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const ProductDetails = () => {
    return (
        <div className="container">
          <center><h1>Place Your Order</h1></center>
            <div className="pview">
            <div className="row">
                <div className="col-md-6">
                    <img src={productImage} alt="Product Image" className="img-fluid" />
                </div>
                <div className="col-md-6">
                    <div className="product-details">
                        <h2 className="product-name">Product Name</h2>
                        <p className="unit-price">Featuring a sleek and timeless design, this bag is made from high-quality materials, ensuring durability and longevity. Its spacious interior offers ample room to carry all your essentials, from your wallet and phone to your cosmetics and even a small tablet. With multiple compartments and pockets, you can effortlessly organize your belongings and find them whenever you need them.</p>
                        <p className="unit-price">RS(Per Unit): 21999.99</p>
                    </div>
                  <form className='fm'>
                    <div className="row mb-3">
                      <label htmlFor="quantity" className="col-sm-4 col-form-label">Quantity</label>
                      <div className="col-sm-8">
                        <input type="number" className="form-control" id="quantity" />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label htmlFor="price" className="col-sm-4 col-form-label">Price</label>
                      <div className="col-sm-8">
                        <input type="number" step="0.01" className="form-control" id="price" />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label htmlFor="country" className="col-sm-4 col-form-label">Country</label>
                      <div className="col-sm-8">
                        <select className="form-select" id="country">
                          <option value="">Select a country</option>
                          <option value="sl">Sri Lanka</option>
                          <option value="us">United States</option>
                          <option value="ca">Canada</option>
                          <option value="uk">United Kingdom</option>
                        </select>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label htmlFor="Delivery Address" className="col-sm-4 col-form-label">Delivery Address</label>
                      <div className="col-sm-8">
                        <input type="text" step="0.01" className="form-control" id="Delivery_Address" />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label htmlFor="Expected_Date" className="col-sm-4 col-form-label">Expected Date</label>
                      <div className="col-sm-8">
                        <input type="date" step="0.01" className="form-control" id="Expected_Date" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 text-end">
                        <button type="submit" className="btn btn-primary">Request</button>
                      </div>
                    </div>
                  </form>
                </div>

            </div>
            </div>
        </div>
    );
};

export default ProductDetails;
