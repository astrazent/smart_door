import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
export const createAccessToken = payload => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    })
}
export const verifyAccessToken = token => {
    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET)
        return decoded
    } catch (err) {
        return null
    }
}
