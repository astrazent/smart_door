/**
 * Chức năng: Quản lý biến môi trường, load từ .env và chuẩn hóa cho toàn dự án
 */
import dotenv from 'dotenv'
dotenv.config() 

export const env = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 55558,
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'smart_lock',
    APP_PORT: process.env.APP_PORT || 8027,
    APP_HOST: process.env.APP_HOST || 'localhost',
    BUILD_MODE: process.env.BUILD_MODE,
    
    AUTHOR: process.env.AUTHOR || 'NP',
}
