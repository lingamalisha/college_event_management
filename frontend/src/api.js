import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the JWT token
API.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

// Add a response interceptor for better error visibility
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Network error occurred';
        
        // Log more details for debugging
        if (error.response) {
            console.error(`🔴 API Error [${error.response.status}]:`, message);

            // Auto-logout if token is invalid or expired
            if (error.response.status === 401) {
                localStorage.removeItem('userInfo');
                // Redirect to login if not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        } else {
            console.error('🔴 API Connection Error:', message);
        }
        
        return Promise.reject(error);
    }
);

export default API;

