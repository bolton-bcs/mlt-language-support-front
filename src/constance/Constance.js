import {asDev} from "../services/apiConfig";

export const BASE_URL = !asDev ? "/admin" : "/story-book-admin";
export const CLIENT_NAME = 'admin';
export const CLIENT_SECRET = '';
export const USER_ROLE_01 ='partneraussie';
