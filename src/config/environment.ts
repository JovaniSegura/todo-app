const environments = {
  development: {
    apiUrl: 'http://localhost:8081'
  },
  production: {
    apiUrl: 'https://your-production-api.com'
  },
};

export const environment = environments[import.meta.env.MODE === 'production' ? 'production' : 'development'];