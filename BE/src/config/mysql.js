import mysql from 'mysql2/promise'
import { env } from './environment.js'

let connection = null

export const createConnection = async () => {
    try {
        connection = await mysql.createConnection({
            host: env.DB_HOST,
            port: env.DB_PORT,
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME,
        })

        console.log('✅ Connected to MySQL database successfully!')
        return connection
    } catch (error) {
        console.error('❌ MySQL connection failed:', error)
        throw error
    }
}

export const closeConnection = async () => {
    if (connection) {
        await connection.end()
        console.log('✅ MySQL connection closed successfully!')
    }
}

export const getConnection = () => {
    if (!connection) {
        throw new Error('MySQL connection not established')
    }
    return connection
}
