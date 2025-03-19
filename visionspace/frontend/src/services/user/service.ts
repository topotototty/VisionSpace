import { apiClient, apiClientWithAuth } from "services/api/service";
import { IUser } from "models/User";
import { ROLE_PERMISSIONS } from "constants/index";


class UserService {

    public checkUser = () => {
        const rawData = localStorage.getItem('user');
        if (!rawData)
            return false;
        return true;
    }


    public profile = async () => {
        return await apiClientWithAuth.get(
            `users/profile/`,
            {}
        ).then(response => response.data).catch(error => console.log(error))
    }


    public getUserById = (id: string) => {
        return apiClient.get(
            `users/profile/${id}/`,
            {}
        ).then(response => response.data).catch(error => console.log(error))
    }


    // Сохранение данных пользователя
    public setUser = (user: IUser) => {
        // Пользователя сохраняем в LocalStorage
        localStorage.setItem("user", JSON.stringify(user));
    }


    // Получение данных пользователя
    public getUser = () => {
        if (this.checkUser()) // Если true
            return JSON.parse(localStorage.getItem("user") || "{}") as IUser;
    }


    public isAdmin = (user: IUser) => {
        if (!user)
            return false

        switch (user.role) {
            case "MODERATOR":
                return true;
            case "TECH_SUPPORT":
                return true;
            default:
                return false;
        }

    }


    // Удаление данных пользователя
    public removeUser = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("conferences")
        localStorage.removeItem("redirectTo")
    }


    public hasRole(user: IUser, requiredRole: string): boolean {
        if (!user || !requiredRole) {
            return false;
        }
        return user.role === requiredRole
    }


    public getPermissions = (): string[] => {
        const user = this.getUser();
        if (!user) {
            return [];
        }
        return ROLE_PERMISSIONS[user.role];
    }


    public getRoleTranslate = (): string => {
        const user = this.getUser();
        if (user)
            switch (user.role) {
                case "MODERATOR":
                    return "Модератор";
                case "TECH_SUPPORT":
                    return "Тех. поддержка";
                default:
                    return "Участник";
            }
        return "";
    }
}

export default new UserService();