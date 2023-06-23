import ApiService from './apiService';

export async function getAllBooks(pagination) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/book/all?page=${pagination.page}&size=${pagination.size}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function saveBook(body) {
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/book/save`;
  apiObject.multipart = true;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

export async function updateBook(body) {
  const apiObject = {};
  apiObject.method = 'PUT';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/book/update`;
  apiObject.multipart = true;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

export async function searchBook(pagination) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/book/search?page=${pagination.page}&size=${pagination.size}&name=${pagination.name}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getBookCount() {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.multipart = false;
  apiObject.endpoint = `web/admin/book/count`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function updateBookStatus(body){
  const apiObject = {};
  apiObject.method = 'PUT';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.multipart = false;
  apiObject.endpoint = `web/admin/book/update/status`;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}
