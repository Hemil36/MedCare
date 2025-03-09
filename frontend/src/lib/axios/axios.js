import axios from 'axios';


export const axiosurl = axios.create({
    baseURL: 'https://med-id-backend.vercel.app/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})