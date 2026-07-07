import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const conectarApi = axios.create({
    baseURL: 'https://ofeckbartify-production.up.railway.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

conectarApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const auth = useAuthStore()
            auth.logout()
        }
        return Promise.reject(error)
    }
)

export default conectarApi;