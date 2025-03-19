export interface IAccessToken {
    access: string
}


export interface IRefreshToken {
    refresh: string
}


export interface ITokens extends IAccessToken, IRefreshToken {}