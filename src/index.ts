import axios from 'axios'
import { store, generateSign } from './common'
export { setAuth } from './common'

export async function translate(keyworld: string | string[], to = 'en'): Promise<YOUDAO_TRANSLATE.Result[]>  {
    if (Array.isArray(keyworld)) keyworld = keyworld.join(`\n`)

    const query = {
        q: keyworld,
        from: `auto`,
        to,
        appKey: store.auth.AppID,
        salt: Date.now(),
        sign: ``,
        signType: `v3`,
        curtime: Math.floor(Date.now() / 1000),
    }

    query.sign = generateSign(keyworld, query.salt, query.curtime)

    const { data } = await axios.get(store.URL, {
        params: query,
    })
    
    if (data.errorCode === '0') {
        const [result] = data.translation
        const originals = data.query.split(`\n`)

        return result.split(`\n`).map((translated: string, index: number) => ({
            original: originals[index],
            translated,
        }))
    } else {
        console.error(`errorCode: ${data.errorCode}`)
    }
}
