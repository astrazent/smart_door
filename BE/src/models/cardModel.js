import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const CARDS_TABLE_NAME = 'cards'

const CARDS_SCHEMA = Joi.object({
    card_uid: Joi.string().max(50).required().messages({
        'string.empty': 'card_uid không được để trống',
        'string.max': 'card_uid tối đa 50 ký tự',
    }),
    user_id: Joi.number().integer().allow(null),
    is_active: Joi.boolean().default(true),
    registered_at: Joi.date().optional(),
})

const CardsModel = {
    async createCard(data) {
        const { error, value } = CARDS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${CARDS_TABLE_NAME} (card_uid, user_id, is_active, registered_at)
            VALUES (?, ?, ?, ?)`,
            [
                value.card_uid,
                value.user_id || null,
                value.is_active,
                value.registered_at || new Date(),
            ]
        )
        return { id: result.insertId, ...value }
    },

    async getCardById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CARDS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async getCardByUid(card_uid) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CARDS_TABLE_NAME} WHERE card_uid = ? LIMIT 1`,
            [card_uid]
        )
        return rows[0] || null
    },

    async updateCard(id, data) {
        const schema = CARDS_SCHEMA.fork(
            Object.keys(CARDS_SCHEMA.describe().keys),
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
            `UPDATE ${CARDS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )
        return this.getCardById(id)
    },

    async deleteCard(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${CARDS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listCards(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT c.*, u.full_name AS user_name
            FROM ${CARDS_TABLE_NAME} c
            LEFT JOIN users u ON c.user_id = u.id
            ORDER BY c.id DESC
            LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
    async listCardsUser(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT 
            c.id AS card_id,
            c.card_uid,
            c.is_active,
            c.registered_at,
            u.id AS user_id,
            u.full_name AS user_name,
            u.username,
            u.email,
            u.phone,
            u.role
        FROM cards c
        LEFT JOIN users u ON c.user_id = u.id
        ORDER BY c.id DESC
        LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
    async listCardsESP() {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT 
            c.card_uid AS uid,
            u.full_name AS name
        FROM ${CARDS_TABLE_NAME} c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE u.id IS NOT NULL
        ORDER BY c.id DESC`
        )
        return rows
    },
}

export { CARDS_TABLE_NAME, CARDS_SCHEMA, CardsModel }
