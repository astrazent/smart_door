import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const BOARDS_TABLE_NAME = 'Boards'

// Schema validate dữ liệu board
const BOARDS_SCHEMA = Joi.object({
    title: Joi.string().min(3).max(255).required().messages({
        'string.empty': 'Title không được để trống',
        'string.min': 'Title tối thiểu 3 ký tự',
        'string.max': 'Title tối đa 255 ký tự',
    }),
    slug: Joi.string().max(255).required().messages({
        'string.empty': 'Slug không được để trống',
        'string.max': 'Slug tối đa 255 ký tự',
    }),
})

const BoardsModel = {
    
    async createBoard(data) {
        const { error, value } = BOARDS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${BOARDS_TABLE_NAME} (title, slug) VALUES (?, ?)`,
            [value.title, value.slug]
        )

        return { board_id: result.insertId, ...value }
    },

    
    async getBoardById(board_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${BOARDS_TABLE_NAME} WHERE board_id = ?`,
            [board_id]
        )
        return rows[0] || null
    },

    
    async updateBoard(board_id, data) {
        const schema = BOARDS_SCHEMA.fork(
            Object.keys(BOARDS_SCHEMA.describe().keys),
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
            `UPDATE ${BOARDS_TABLE_NAME} SET ${setClause} WHERE board_id = ?`,
            [...values, board_id]
        )

        return this.getBoardById(board_id)
    },

    
    async deleteBoard(board_id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${BOARDS_TABLE_NAME} WHERE board_id = ?`,
            [board_id]
        )
        return result.affectedRows > 0
    },

    
    async listBoards(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${BOARDS_TABLE_NAME} ORDER BY board_id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { BOARDS_TABLE_NAME, BOARDS_SCHEMA, BoardsModel }
