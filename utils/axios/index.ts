import axios from 'axios';

export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_API + '/api';
};

export const axiosAPI = axios.create({
  baseURL: getBaseUrl(),
});

export const axiosAPIWithoutAuth = axios.create({
  baseURL: getBaseUrl(),
});

axiosAPIWithoutAuth.interceptors.request.use(async (request) => {
  const localToken = localStorage.getItem('access_token');
  if (localToken) {
    request.headers.Authorization = `Bearer ${localToken}`;
  }
  return request;
});
