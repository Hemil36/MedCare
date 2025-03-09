// src/hooks/RefreshToken.js
import { setAccessToken } from '../lib/store/UserSlice';
import { store } from '../lib/store/store';
import { axiosurl as axios } from '@/lib/axios/axios';
const RefreshToken = () => {
  const refresh = async () => {

    const response = await axios.get('/refresh', {
      withCredentials: true,
    });


    store.dispatch(setAccessToken(response.data.accessToken));
    return response.data.accessToken;
  };

  return refresh;
};

export default RefreshToken;
