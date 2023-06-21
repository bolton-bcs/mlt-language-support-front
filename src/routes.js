import React from 'react';
import DefaultLayout from './containers/DefaultLayout';
import {BASE_URL} from './constance/Constance';


const Login = React.lazy(() => import('./views/Pages/Login/Login'));
const ErrorPage =React.lazy(() => import('./views/Pages/Page404/Page404'));
const ErrorPage1 =React.lazy(() => import('./views/Pages/Page500/Page500'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {path: '/', exact: true, name: 'Home', component: DefaultLayout},
  {path: BASE_URL + '/login', exact: true, name: 'Login Page', component: Login},
  {path: BASE_URL + '/404', exact: true, name: '404 Page', component: ErrorPage},
  {path: BASE_URL + '/500', exact: true, name: '500 Page', component: ErrorPage1},
];

export default routes;
