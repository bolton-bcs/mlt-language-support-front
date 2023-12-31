import axios from 'axios';
import apiConfig from './apiConfig';
import Cookies from "js-cookie";
import * as constants from "../constance/Constance";
import {StorageStrings} from "../constance/StorageStrings";

import * as authService from "./auth";
import qs from "qs";
import swal from "sweetalert";
import * as commonFunc from "../utils/CommonFunc";
import * as CommonFunc from "../utils/CommonFunc";


export const callApi = async (apiObject) => {
  let body = {};
  let headers;
  let method = apiObject.method ? apiObject.method.toLowerCase() : 'get';

  if (method === 'post' || method === 'put' || method === 'patch') {
    body = apiObject.body ? apiObject.body : {};
  }

  headers = {
    'Content-Type': apiObject.urlencoded ? 'application/x-www-form-urlencoded' : apiObject.multipart ? 'multipart/form-data' : 'application/json',
  };
  if (apiObject.authentication) {
    let access_token = localStorage.getItem(StorageStrings.ACCESS_TOKEN);
    if (access_token) {
      headers.Authorization = `Bearer ${access_token}`;
    }
  }
  if (apiObject.isBasicAuth) {
    headers.Authorization = 'Basic ' + btoa('' + constants.CLIENT_NAME + ':' + constants.CLIENT_SECRET + '');
  }


  const url = `${apiConfig.serverUrl}/${apiConfig.basePath}/${apiObject.endpoint}`;
  let result;

  await axios[method](url, method !== 'get' && method !== 'delete' ? body : {headers:headers,data:null}, {headers:headers})
    .then(async response => {
      if (!response.data.success) {
        let code = response.data.code;
        if (code === 470 || code === 471) {
          await commonFunc.removeCookiesValues();
          await CommonFunc.clearLocalStorage();
          window.location = constants.BASE_URL + '/login';
        }
      }
      result = await {...response.data, datas:response.data, status: response.data.message === 'Success' || response.data.message === 'OK' ? 1 : 0, success: response.data.message === 'Success' || response.data.message === 'OK' || response.data.message === undefined};
    })
    .catch(async error => {

      if (error !== undefined) {
        if (error.response === undefined) {
          result = await {
            success: false,
            status: 2,
            message: "Your connection was interrupted",
            data: null,
          }
        } else if (error.response.status === 401) {

          if (apiObject.state === "renewToken") {
            result = await {success: false, status: 2, message: error.response.data.message};
            return;
          }
          if (apiObject.state === "login") {
            result = await {success: false, status: 0, message: error.response.data.message};
            return;
          }
          result = await renewTokenHandler(apiObject);

        } else if (error.response.status === 403) {
          result = await {
            success: false,
            status: 2,
            message: "Access is denied.",
            data: null,
          };
        } else if (error.response.status === 417) {
          result = await {
            success: false,
            status: 2,
            message: "Oops! Something went wrong.",
            data: null,
          };
        } else if (error.response.data !== undefined) {
          result = await {
            success: false,
            status: 0,
            message: error.response.data.message,
            data: null,
          }
        } else {
          result = await {
            success: false,
            status: 2,
            message: "Sorry, something went wrong.",
            data: null,
          };
        }
      } else {
        result = await {
          success: false,
          status: 2,
          message: "Your connection was interrupted!",
          data: null,
        };
      }
    });

  return result;
};
const renewTokenHandler = async (apiObject) => {
  let result;
  // renew token - start
  const obj = {
    refresh_token: localStorage.getItem(StorageStrings.REFRESH_TOKEN),
    grant_type: 'refresh_token',
    user_type: 'ADMIN'
  };
  await authService.renewToken(qs.stringify(obj))
    .then(async response => {
      if (response.access_token) {
        Cookies.set(StorageStrings.ACCESS_TOKEN, response.access_token);
        localStorage.setItem(StorageStrings.ACCESS_TOKEN, response.access_token);
        Cookies.set(StorageStrings.REFRESH_TOKEN, response.refresh_token);
        localStorage.setItem(StorageStrings.REFRESH_TOKEN, response.refresh_token);
        result = await callApi(apiObject);
      } else {
        result = await response;
        swal({
          title: response.message,
          icon: null,
          closeOnClickOutside: false,
          buttons: {dangerMode: {text: "Okay", value: "action"}}
        })
          .then((value) => {
            switch (value) {
              case "action":
                commonFunc.removeCookiesValues();
                CommonFunc.clearLocalStorage();
                window.location = constants.BASE_URL + '/login';
                break;
              default:
                break;
            }
          });
      }
    });
  // renew token - end
  return result;
};

export default {callApi, renewTokenHandler};
