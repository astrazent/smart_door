import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const NOTIFICATION_TABLE_NAME = 'notifications'

const NOTIFICATION_SCHEMA = Joi.object({
    user_id: Joi.number().integer().allow(null).messages({
        'number.base': 'user_id phải là số nguyên',
    }),
    door_id: Joi.number().integer().allow(null).messages({
        'number.base': 'door_id phải là số nguyên',
    }),
    title: Joi.string().max(255).required().messages({
        'any.required': 'title là bắt buộc',
        'string.max': 'title không được vượt quá 255 ký tự',
    }),
    message: Joi.string().required().messages({
        'any.required': 'message là bắt buộc',
    }),
    type: Joi.string()
        .valid('INFO', 'WARNING', 'ERROR', 'ACCESS', 'SYSTEM')
        .default('INFO'),
    is_read: Joi.boolean().default(false),
})

const NotificationModel = {
    async createNotification(data) {
        const { error, value } = NOTIFICATION_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${NOTIFICATION_TABLE_NAME}
            (user_id, door_id, title, message, type, is_read)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                value.user_id || null,
                value.door_id || null,
                value.title,
                value.message,
                value.type,
                value.is_read,
            ]
        )
        return { id: result.insertId, ...value }
    },

    async getNotificationById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT n.*, 
                    u.full_name AS user_name, 
                    d.name AS door_name 
            FROM ${NOTIFICATION_TABLE_NAME} n
            LEFT JOIN users u ON n.user_id = u.id
            LEFT JOIN doors d ON n.door_id = d.id
            WHERE n.id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updateNotification(id, data) {
        const schema = NOTIFICATION_SCHEMA.fork(
            Object.keys(NOTIFICATION_SCHEMA.describe().keys),
            f => f.optional()
        )
        const { error, value } = schema.validate(data, { abortEarly: false })
        if (error) throw error

        const fields = Object.keys(value)
        const values = Object.values(value)
        if (!fields.length) return null

        const setClause = fields.map(f => `${f} = ?`).join(', ')
        const conn = getConnection()
        await conn.execute(
            `UPDATE ${NOTIFICATION_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )
        return this.getNotificationById(id)
    },

    async deleteNotification(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${NOTIFICATION_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listNotifications(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT n.*, 
                    u.full_name AS user_name, 
                    d.name AS door_name 
            FROM ${NOTIFICATION_TABLE_NAME} n
            LEFT JOIN users u ON n.user_id = u.id
            LEFT JOIN doors d ON n.door_id = d.id
            ORDER BY n.id DESC
            LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { NOTIFICATION_TABLE_NAME, NOTIFICATION_SCHEMA, NotificationModel }
