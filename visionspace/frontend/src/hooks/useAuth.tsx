import { createContext, FC, useContext, useEffect, useState } from "react";
import { IAuthContextType, IUser } from "models/User";
import UserService from "services/user/service";
import TokensService from "services/token/service";
import { isIUser } from "lib/utils";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}


export const AuthProvider: FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Получение пользователя
        try {
            if (UserService.checkUser()) {
                const userData = UserService.getUser();
                if (userData !== undefined) {
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        if (!user) {
            setLoading(false);
        }
    }, [user]);


    // Таймер раз в 30 секунд проверять информацию о пользователе
    useEffect(() => {
        if (user) {
            const intervalId = setInterval(async () => {
                const userData = await UserService.profile();
                if (userData?.user && isIUser(userData?.user)) {
                    UserService.setUser(userData?.user);
                    setUser(userData?.user);
                }
            }, 5000);
            return () => clearInterval(intervalId);
        }
    }, [user]);


    const login = (user: IUser) => {
        try {
            setLoading(true);
            if (!isIUser(user)) {
                throw new Error("Invalid user data");
            }
            UserService.setUser(user);
            setUser(user);
        } catch (error) {
            console.error('Ошибка при входе:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        // Удаление пользователя из стора
        UserService.removeUser();
        TokensService.clear();
        setUser(null);
    }

    return <AuthContext.Provider value={{user, login, logout, loading}}>{children}</AuthContext.Provider>
}