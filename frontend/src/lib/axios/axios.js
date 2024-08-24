import axios from 'axios';


export const axiosurl = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})