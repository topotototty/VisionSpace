// services/api/service.ts
import { BASE_API_URL } from 'constants/index';
import axios from 'axios';
import TokensService from 'services/token/service';
import UserService from 'services/user/service';

/**
 * Этот клиент (apiClient) — без авторизации, 
 * подходит для публичных запросов или для гостевого доступа.
 */
const apiClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Этот клиент (apiClientWithAuth) — с авторизацией,
 * он автоматически цепляет токен в заголовок Authorization, 
 * а также обрабатывает 401 (истёкший токен).
 */
const apiClientWithAuth = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----- 1) Интерсептор запросов: добавляем access-токен в заголовок -----
apiClientWithAuth.interceptors.request.use(
  (config) => {
    // Достаем access-токен из localStorage (через TokensService)
    const token = TokensService.getAccessToken();
    console.log("🔑 Access Token в интерцепторе:", token);

    // Если запрос на обновление токена (users/auth/token/) или провайдеры входа —
    // игнорируем проставление заголовка, чтобы не поймать лишний 401.
    const url = config.url;
    if (url === "users/auth/token/" || url?.startsWith("users/auth/providers")) {
      return config;
    }

    // Если токен есть, добавляем его в заголовок
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ----- 2) Интерсептор ответов: пытаемся рефрешить access-токен при 401 -----
apiClientWithAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;

    // Проверяем, что это не запрос на получение токена 
    // и что сервер вернул 401, и запрос ещё не повторялся.
    if (originalConfig.url !== 'users/auth/token/' && error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          // Достаём refresh-токен
          const refreshToken = TokensService.getRefreshToken();
          if (!refreshToken) {
            throw new Error("Refresh token not found");
          }

          // Пытаемся обновить access-токен
          const response = await apiClientWithAuth.post('users/auth/token/', {
            refresh: refreshToken,
          });

          const { access } = response.data;
          if (access) {
            // Сохраняем новый access-токен в localStorage
            TokensService.setAccessToken(access);

            // Проставляем его в заголовок и пробуем повторить запрос
            originalConfig.headers['Authorization'] = `Bearer ${access}`;
            return apiClientWithAuth(originalConfig);
          }
        } catch (refreshError) {
          // Если не удалось обновить — выходим из учётной записи
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

export { apiClient, apiClientWithAuth };
