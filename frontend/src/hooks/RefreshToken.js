// src/hooks/RefreshToken.js
import { setAccessToken } from '../lib/store/UserSlice';
import { store } from '../lib/store/store';
import axios from 'axios';

const RefreshToken = () => {
  const refresh = async () => {

    const response = await axios.get('http://localhost:3000/api/refresh', {
      withCredentials: true,
    });


    store.dispatch(setAccessToken(response.data.accessToken));
    return response.data.accessToken;
  };

  return refresh;
};

export default RefreshToken;
