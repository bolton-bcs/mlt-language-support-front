import ApiService from "./apiService";

export async function getPaymentHistory(pagination) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/payment/history?page=${pagination.page}&size=${pagination.size}&name=${pagination.name}${pagination.packageType !== '' ? `&packageId=` + pagination.packageType : ``}${pagination.startDateTime !== '' ? `&startDateTime=` + pagination.startDateTime : ``}${pagination.endDateTime !== '' ? `&endDateTime=` + pagination.endDateTime : ''}${pagination.purchaseStatus !== '' ? `&purchaseStatus=` + pagination.purchaseStatus : ''}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getIncome(pagination) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/payment/history/success?page=${pagination.page}&size=${pagination.size}${pagination.startDateTime !== '' ? `&startDateTime=` + pagination.startDateTime : ``}${pagination.endDateTime !== '' ? `&endDateTime=` + pagination.endDateTime : ''}${pagination.school !== '' ? `&school=` + pagination.school : ''}${pagination.country !== '' ? `&country=` + pagination.country : ''}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getTotalCount(data) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/payment/history/success/total${data.startDateTime !== '' ? `?startDateTime=` + data.startDateTime : ``}${data.endDateTime !== '' ? `&endDateTime=` + data.endDateTime : ''}${data.country !== '' ? `${data.startDateTime !== '' ? '&' : '?'}country=` + data.country : ''}${data.school !== '' ? '?school=' + data.school : ''}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getUserIncomesCSV() {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/payment/history/success/all`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}
