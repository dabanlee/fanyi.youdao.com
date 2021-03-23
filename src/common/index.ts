import { SHA256, enc } from 'crypto-js'

export const store: {
    auth?: Partial<YOUDAO_TRANSLATE.Auth>,
    URL: string,
} = {
    auth: {},
    URL: `https://openapi.youdao.com/api`,
}

export function setAuth(AppID: string, AppSecret: string) {
    store.auth.AppID = AppID
    store.auth.AppSecret = AppSecret
}

export function generateSign(keyworld: string, salt: number, curtime: number) {

    if (!store.auth.AppID || !store.auth.AppSecret) {
        throw new Error(`Generate sign error, use "setAuth({ AppID, Secret })" to authorize.`)
    }

    return SHA256(store.auth.AppID + truncate(keyworld) + salt + curtime + store.auth.AppSecret).toString(enc.Hex)
}

function truncate(string: string) {
    return string.length <= 20 ? string : (string.slice(0, 10) + string.length + string.slice(-10))
}