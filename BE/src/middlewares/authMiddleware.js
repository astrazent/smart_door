import { verifyAccessToken } from '~/utils/token'
import { StatusCodes } from 'http-status-codes'

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        let token = null

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]
        } else if (req.cookies?.access_token) {
            token = req.cookies.access_token
        }

        if (!token) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: 'Token không được cung cấp' })
        }

        const decoded = verifyAccessToken(token)
        req.user = decoded

        next()
    } catch (err) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: 'Token không hợp lệ hoặc hết hạn' })
    }
}
