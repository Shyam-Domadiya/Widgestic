import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add user ID
api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('widgetic_user_id');
    if (userId) {
        config.headers['x-user-id'] = userId;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('widgetic_user_id');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
