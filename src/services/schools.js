import ApiService from './apiService';

export async function getAllSchools(pagination) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/school/search?schoolName=${pagination.name}&page=${pagination.page}&size=${pagination.size}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getAllSchoolsForDropdown() {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/school/all`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function saveSchool(body) {
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/school/save`;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

export async function updateSchool(body) {
  const apiObject = {};
  apiObject.method = 'PUT';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/school/update`;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

