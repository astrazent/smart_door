import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const HISTORY_TABLE_NAME = 'history'

const HISTORY_SCHEMA = Joi.object({
    door_id: Joi.number().integer().required().messages({
        'number.base': 'door_id phải là số',
        'any.required': 'door_id là bắt buộc',
    }),
    user_id: Joi.number().integer().allow(null),
    card_id: Joi.number().integer().allow(null),
    action: Joi.string().valid('OPEN', 'CLOSE', 'FAILED').required().messages({
        'any.only': 'Action phải là OPEN, CLOSE hoặc FAILED',
        'any.required': 'Action là bắt buộc',
    }),
    door_status: Joi.string().valid('OPENED', 'CLOSED').required().messages({
        'any.only': 'door_status phải là OPENED hoặc CLOSED',
        'any.required': 'door_status là bắt buộc',
    }),
    time: Joi.date().optional(),
    note: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Note tối đa 255 ký tự',
    }),
})

const HistoryModel = {
    async createHistory(data) {
        const { error, value } = HISTORY_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${HISTORY_TABLE_NAME} (door_id, user_id, card_id, action, door_status, time, note)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                value.door_id,
                value.user_id || null,
                value.card_id || null,
                value.action,
                value.door_status,
                value.time || new Date(),
                value.note || null,
            ]
        )
        return { id: result.insertId, ...value }
    },

    async getHistoryById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${HISTORY_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async listHistory(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT h.*, u.full_name AS user_name, c.card_uid, d.name AS door_name
            FROM ${HISTORY_TABLE_NAME} h
            LEFT JOIN users u ON h.user_id = u.id
            LEFT JOIN cards c ON h.card_id = c.id
            LEFT JOIN doors d ON h.door_id = d.id
            ORDER BY h.time DESC
            LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
    async listHistoryDoorUser(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT 
            h.id,
            h.action,
            h.door_status,
            h.time,
            h.note,
            u.full_name AS user_name,
            u.username,
            c.card_uid,
            d.name AS door_name,
            d.location
        FROM ${HISTORY_TABLE_NAME} h
        LEFT JOIN users u ON h.user_id = u.id
        LEFT JOIN cards c ON h.card_id = c.id
        LEFT JOIN doors d ON h.door_id = d.id
        ORDER BY h.time DESC
        LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async deleteHistory(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${HISTORY_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async deleteAllHistory() {
        const conn = getConnection()
        const [result] = await conn.execute(`DELETE FROM ${HISTORY_TABLE_NAME}`)
        return result.affectedRows
    },
}

export { HISTORY_TABLE_NAME, HISTORY_SCHEMA, HistoryModel }
