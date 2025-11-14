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
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'NP',
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    ESP_BASE_URL: process.env.ESP_BASE_URL || 'http://192.168.1.53/api',
    FE_BASE_URL: process.env.FE_BASE_URL || 'http://localhost:5173/',
    AUTHOR: process.env.AUTHOR || 'NP',
}
