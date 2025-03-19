import Cookies from "js-cookie"
import  { ITokens } from "models/Token"


class TokensService {
    // Получение токена access
    public getAccessToken = () => {
        return Cookies.get("access") || undefined
    }


    // Получение токена refresh
    public getRefreshToken = () => {
        return Cookies.get("refresh") || undefined
    }


    // Сохранение токена access
    public setAccessToken = (token: string) => {
        Cookies.set("access", token, { expires: 1 })
    }


    // Сохранение токена access
    public setRefreshToken = (token: string) => {
        Cookies.set("refresh", token, { expires: 1 })
    }


    public setTokens = (tokens: ITokens) => {
        this.setAccessToken(tokens.access)
        this.setRefreshToken(tokens.refresh)
    }


    public clear = () => {
        Cookies.remove("access")
        Cookies.remove("refresh")
    }
}


export default new TokensService()