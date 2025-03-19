import { ITokens } from "models/Token"

export interface IUserRole {
    role: "MEMBER" | 'MODERATOR' | 'TECH_SUPPORT'
}

export interface IUser {
    id: string
    firstname: string
    lastname: string
    email: string
    last_login: string
    role: string
}


export interface ILoginProps {
    email: string;
    password: string;
}

export interface IRegisterProps {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}


export interface IProviderLoginProps {
    // Выбор между basic и keycloak
    provider: string;
}


export interface ILoginResponse {
    user: IUser,
    tokens: ITokens
}


export interface IAuthContextType {
    user: IUser | null;
    loading: boolean;
    login: (user: IUser) => void;
    logout: () => void;
}



