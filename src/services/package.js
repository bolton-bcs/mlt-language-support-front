import ApiService from './apiService';

export async function getAllPackage() {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/package/all`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}
