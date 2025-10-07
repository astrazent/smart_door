
import { StatusCodes } from 'http-status-codes'
import { logger } from '../utils/logger.js'
import { env } from '~/config/environment'

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err, req, res, next) => {
    
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

    
    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode], 
        stack: err.stack,
    }
    

    
    if (env.BUILD_MODE !== 'env') delete responseError.stack

    
    
    logger.error(`${err.message}\n${err.stack}`)

    
    res.status(responseError.statusCode).json(responseError)
}
