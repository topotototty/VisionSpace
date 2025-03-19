import { apiClient } from "services/api/service";
import { ILoginProps, IRegisterProps, ILoginResponse } from "models/User";

class AuthService {
    
    // Авторизация пользователя (логин)
    login(provider: 'basic' | 'keycloak', props: ILoginProps): Promise<ILoginResponse> {
        return apiClient.post<ILoginResponse>(
            `users/auth/providers/${provider}/login/`,
            props
        ).then(response => {
            if (response.status == 200) 
                return response.data;
        }).catch(error => {
            console.error(error);
            return error;
        });
    }

    // Регистрация пользователя (новая функция)
    register(props: IRegisterProps): Promise<ILoginResponse> {
        return apiClient.post<ILoginResponse>(
            `users/auth/providers/basic/register/`,  // Эндпоинт регистрации
            props
        ).then(response => {
            if (response.status == 201) 
                return response.data;
        }).catch(error => {
            console.error(error);
            return error;
        });
    }
}

export default new AuthService();
