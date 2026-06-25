import axios from 'axios';

const conectarApi = axios.create({
    baseURL: 'https://ofeckbartify-production.up.railway.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

export default conectarApi;