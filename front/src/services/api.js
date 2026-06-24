import axios from 'axios';

const conectarApi = axios.create({
    baseURL: 'http://localhost:5049',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})


export default conectarApi;