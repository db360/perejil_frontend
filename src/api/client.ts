import axios from 'axios';

const BASE_URL = import.meta.env.VITE_WORDPRESS_API_URL;

console.log('🔗 API Base URL:', BASE_URL); // Para debug

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // Aumentado a 30s
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
})

// Interceptor mejorado para debug
apiClient.interceptors.request.use(
    (config) => {
        console.log('📤 Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('📤 Request Error:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('📥 Response:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        const config = error.config;
        
        console.error('📥 Response Error:', {
            message: error.message,
            status: error.response?.status,
            url: config?.url,
            baseURL: config?.baseURL
        });

        // Retry logic
        if (!config || config.__retryCount >= 3) {
            return Promise.reject(error);
        }

        config.__retryCount = config.__retryCount || 0;
        config.__retryCount += 1;

        const delay = Math.pow(2, config.__retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        console.log(`🔄 Retrying request (${config.__retryCount}/3)...`);
        return apiClient(config);
    }
)