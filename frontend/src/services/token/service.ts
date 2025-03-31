// services/token/service.ts
class TokensService {
    public getAccessToken = () => {
        return localStorage.getItem("access") || undefined;
    }

    public getRefreshToken = () => {
        return localStorage.getItem("refresh") || undefined;
    }

    public setAccessToken = (token: string) => {
        localStorage.setItem("access", token);
    }

    public setRefreshToken = (token: string) => {
        localStorage.setItem("refresh", token);
    }

    public setTokens = (tokens: { access: string; refresh: string; }) => {
        this.setAccessToken(tokens.access);
        this.setRefreshToken(tokens.refresh);
    }

    public clear = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    }
}

export default new TokensService();
