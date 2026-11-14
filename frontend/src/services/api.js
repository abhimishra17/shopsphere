import axios from 'axios';

/**
 * Pre-configured Axios instance.
 * Points to the Spring Boot backend running on port 8080.
 */

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * Axios Request Interceptor:
 * Before EVERY outgoing HTTP request, this function checks if a JWT token
 * is saved in the browser's localStorage. If found, it automatically attaches:
 * 'Authorization: Bearer <token>'
 * 
 * This means you never have to manually attach the token on every API call!
 */

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default api;