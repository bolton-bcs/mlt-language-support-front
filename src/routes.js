import React from 'react';
import DefaultLayout from './containers/DefaultLayout';
import {BASE_URL} from './constance/Constance';


const Product = React.lazy(() => import('./views/Product/Product'));
const Login = React.lazy(() => import('./views/Pages/Login/Login'));
const Register = React.lazy(() => import('./views/Pages/Register/Register'));
const ErrorPage =React.lazy(() => import('./views/Pages/Page404/Page404'));
const ErrorPage1 =React.lazy(() => import('./views/Pages/Page500/Page500'));
const ProductRequest = React.lazy(() => import('./views/ProductRequest/ProductRequest'));
const UserProductDetails = React.lazy(() => import('./views/PublicUser/ProductDetails/ProductDetails'));
const UserProductCatalogue = React.lazy(() => import('./views/PublicUser/ProductCatalogue/ProductCatalogue'));


const routes = [
  {path: '/', exact: true, name: 'Home', component: DefaultLayout},
  {path: BASE_URL + '/manage-products',exact: true, name: 'Manage Products', component: Product},
  {path: BASE_URL + '/login', exact: true, name: 'Login Page', component: Login},
  {path: BASE_URL + '/register', exact: true, name: 'Register Page', component: Register},
  {path: BASE_URL + '/404', exact: true, name: '404 Page', component: ErrorPage},
  {path: BASE_URL + '/500', exact: true, name: '500 Page', component: ErrorPage1},
  {path: BASE_URL + '/manage-product-request', exact: true, name: 'Manage Product Request', component: ProductRequest},
  {path: BASE_URL + '/product-details', exact: true, name: 'Manage Product Details', component: UserProductDetails},
  {path: BASE_URL + '/product-catalogue', exact: true, name: 'Manage Product catalogue', component: UserProductCatalogue},
];

export default routes;
