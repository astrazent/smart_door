import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import exitHook from 'async-exit-hook'
import { createConnection, closeConnection } from '~/config/mysql.js'
import { env } from '~/config/environment.js'
import { APIs_V1 } from '~/routes/index.js'
import { APIs_V2 } from '~/routes/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandling'

const START_SERVER = () => {
    const app = express()

    
    app.use(
        cors({
            origin: 'http://localhost', 
            methods: ['GET', 'POST', 'PUT', 'DELETE'], 
            allowedHeaders: ['Content-Type', 'Authorization'], 
            credentials: true, 
        })
    )

    
    app.use(cookieParser())

    
    app.use(express.json()) 
    app.use(express.urlencoded({ extended: true })) 

    
    app.use('/v1', APIs_V1)
    app.use('/v2', APIs_V2)

    
    app.use(errorHandlingMiddleware)

    
    const server = app.listen(env.APP_PORT, env.APP_HOST, () => {
        console.log(
            `3. Hi ${env.AUTHOR}, Back-end Server is running successfully at Host: ${env.APP_HOST} and Port: ${env.APP_PORT}`
        )
    })

    
    exitHook(() => {
        console.log('4. Server is shutting down...')
        closeConnection() 
        console.log('5. Disconnected from MySQL Database')
    })

    return server 
}

// Kết nối Database trước khi start Server
createConnection() 
    .then(() => console.log('1. Connected to MySQL Database!'))
    .then(() => console.log('2. Starting server...'))
    .then(() => START_SERVER())
    .catch(error => {
        console.error(error)
        process.exit(0)
    })

/**
 * MỤC ĐÍCH CHÍNH CỦA EXPORT SERVER:
 * - Cho phép testing: Import server để viết unit/integration tests
 * - Tái sử dụng: Có thể khởi động server từ nhiều file khác nhau
 * - Linh hoạt: Tuỳ chỉnh config khi khởi động (port, host, options)
 * - Microservices: Khởi tạo nhiều server instance nếu cần
 *
 * 🚨 Lưu ý: Server auto-start khi import - phù hợp production
 * nhưng cần refactor nếu muốn testing linh hoạt hơn
 */
export default START_SERVER
