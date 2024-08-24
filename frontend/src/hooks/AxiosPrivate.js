// src/hooks/AxiosPrivate.js
import RefreshToken from './RefreshToken';
import { axiosurl } from '../lib/axios/axios';
import { store } from '../lib/store/store';
import { setAccessToken } from '../lib/store/UserSlice';

const AxiosPrivate = () => {
  const refresh = RefreshToken();
  const accessToken = store.getState().user.user.accessToken;
  console.log(accessToken);

  axiosurl.interceptors.request.use(
    (config) => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosurl.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error?.config;
      if (error?.response?.status === 403 && !prevRequest?.sent) {
        prevRequest.sent = true;
        const newAccessToken = await refresh();
        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        store.dispatch(setAccessToken(newAccessToken));
        return axiosurl(prevRequest);
      }
      return Promise.reject(error);
    }
  );

  return axiosurl;
};

export default AxiosPrivate;
