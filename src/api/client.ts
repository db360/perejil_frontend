import axios from 'axios';

const BASE_URL = import.meta.env.VITE_WORDPRESS_API_URL;

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // Aumentado a 30s
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
})

// Retry logic para llamadas fallidas
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // Si no hay config o ya se reintentó 3 veces, rechazar
        if (!config || config.__retryCount >= 3) {
            console.error('API call error:', error);
            return Promise.reject(error);
        }

        // Incrementar contador de reintentos
        config.__retryCount = config.__retryCount || 0;
        config.__retryCount += 1;

        // Esperar antes de reintentar (backoff exponencial)
        const delay = Math.pow(2, config.__retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        console.log(`Retrying request (${config.__retryCount}/3)...`);
        return apiClient(config);
    }
)