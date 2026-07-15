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

const RUTAS_EXCLUIDAS_DE_LOGOUT = ['/api/usuarios/logout', '/api/auth/me'];

conectarApi.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || '';
        const esRutaExcluida = RUTAS_EXCLUIDAS_DE_LOGOUT.some(ruta => url.includes(ruta));

        if (error.response?.status === 401 && !esRutaExcluida) {
            const auth = useAuthStore()
            auth.logout()
        }
        return Promise.reject(error)
    }
)

export default conectarApi;