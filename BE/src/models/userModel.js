import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const USERS_TABLE_NAME = 'users'

const USERS_SCHEMA = Joi.object({
    full_name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Full name không được để trống',
        'string.min': 'Full name tối thiểu 3 ký tự',
        'string.max': 'Full name tối đa 100 ký tự',
    }),
    username: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Username không được để trống',
        'string.min': 'Username tối thiểu 3 ký tự',
        'string.max': 'Username tối đa 50 ký tự',
    }),
    email: Joi.string().email().max(100).allow('', null).messages({
        'string.email': 'Email không hợp lệ',
        'string.max': 'Email tối đa 100 ký tự',
    }),
    phone: Joi.string().max(20).allow('', null).messages({
        'string.max': 'Phone tối đa 20 ký tự',
    }),
    password_hash: Joi.string().required().messages({
        'string.empty': 'Password không được để trống',
    }),
    role: Joi.string().valid('admin', 'member').default('member'),
})

const UsersModel = {
    async createUser(data) {
        const { error, value } = USERS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${USERS_TABLE_NAME} (full_name, username, email, phone, password_hash, role)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                value.full_name,
                value.username,
                value.email || null,
                value.phone || null,
                value.password_hash,
                value.role,
            ]
        )
        return { id: result.insertId, ...value }
    },

    async getUserById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async getUserByUsername(username) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} WHERE username = ? LIMIT 1`,
            [username]
        )
        return rows[0] || null
    },

    async getUserByEmail(email) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} WHERE email = ? LIMIT 1`,
            [email]
        )
        return rows[0] || null
    },
    async getUserByUid(uid) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT u.*
            FROM ${USERS_TABLE_NAME} u
            INNER JOIN cards c ON c.user_id = u.id
            WHERE c.card_uid = ? AND c.is_active = TRUE
            LIMIT 1`,
            [uid]
        )
        return rows[0] || null
    },

    async updateUser(id, data) {
        const schema = USERS_SCHEMA.fork(
            Object.keys(USERS_SCHEMA.describe().keys),
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
            `UPDATE ${USERS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )
        return this.getUserById(id)
    },

    async deleteUser(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${USERS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listUsers(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { USERS_TABLE_NAME, USERS_SCHEMA, UsersModel }
