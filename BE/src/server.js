import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import exitHook from 'async-exit-hook'
import { createConnection, closeConnection } from '~/config/mysql.js'
import { env } from '~/config/environment.js'
import { APIs_V1, APIs_V2 } from '~/routes/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandling.js'
import getPort from 'get-port'

const APP_PORT = parseInt(env.APP_PORT) || 2000

const fallbackPorts = Array.from(
    { length: 5000 - 2000 + 1 },
    (_, i) => 2000 + i
)

const portsToTry = [APP_PORT, ...fallbackPorts.filter(p => p !== APP_PORT)]

let serverInstance

const START_SERVER = async () => {
    try {
        const port = await getPort({ port: portsToTry })
        console.log('Server chạy trên port:', port)

        const app = express()

        app.use(
            cors({
                origin: env.FE_BASE_URL,
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
                credentials: true,
            })
        )
        app.use(cookieParser())
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        app.use('/v1', APIs_V1)
        app.use('/v2', APIs_V2)
        app.use(errorHandlingMiddleware)

        serverInstance = app.listen(port, env.APP_HOST, () => {
            console.log(`Server running at Host: ${env.APP_HOST} Port: ${port}`)
        })

        exitHook(() => {
            console.log('Server is shutting down...')
            if (serverInstance) {
                serverInstance.close(() => {
                    console.log('HTTP server closed.')
                })
            }
            closeConnection()
            console.log('Disconnected from MySQL Database')
        })
    } catch (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
    }
}

createConnection()
    .then(() => console.log('Connected to MySQL Database!'))
    .then(() => START_SERVER())
    .catch(error => {
        console.error('Failed to start server:', error)
        process.exit(1)
    })

export default START_SERVER
