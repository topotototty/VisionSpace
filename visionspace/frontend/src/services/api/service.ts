import { BASE_API_URL } from 'constants/index';
import axios from 'axios';
import TokensService from 'services/token/service';
import UserService from 'services/user/service';


const apiClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const apiClientWithAuth = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClientWithAuth.interceptors.request.use(
  (config) => {
    const token = TokensService.getAccessToken();
    const url = config.url

    if (url === "users/auth/token/" || url?.startsWith("users/auth/providers")) {
      return config
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
);


// Обработка ответа
apiClientWithAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;

    if (originalConfig.url !== 'users/auth/token/' && error.response) {
      // Проверка на истекший токен
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const refreshToken = TokensService.getRefreshToken();

          if (!refreshToken) {
            throw new Error("Refresh token not found");
          }

          const response = await apiClientWithAuth.post(
            'users/auth/token/',
            {
              refresh: refreshToken,
            },
          )

          const { access } = response.data;
          if (access) {
            TokensService.setAccessToken(access);
            return apiClientWithAuth(originalConfig);
          }
        } catch (refreshError) {
          TokensService.clear();
          UserService.removeUser();
          window.location.href = "/sign-in";
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);


export {apiClient, apiClientWithAuth};