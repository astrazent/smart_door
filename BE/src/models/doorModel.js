import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const DOORS_TABLE_NAME = 'doors'

const DOORS_SCHEMA = Joi.object({
    door_code: Joi.string().max(50).required().messages({
        'string.empty': 'Mã định danh cửa không được để trống',
        'string.max': 'Mã định danh cửa tối đa 50 ký tự',
    }),
    name: Joi.string().max(100).required().messages({
        'string.empty': 'Tên cửa không được để trống',
        'string.max': 'Tên cửa tối đa 100 ký tự',
    }),
    location: Joi.string().max(100).allow('', null).messages({
        'string.max': 'Vị trí tối đa 100 ký tự',
    }),
    is_active: Joi.boolean().default(true),
    current_status: Joi.string().valid('OPENED', 'CLOSED').default('CLOSED'),
})

const DoorsModel = {
    async createDoor(data) {
        const { error, value } = DOORS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${DOORS_TABLE_NAME} 
            (door_code, name, location, is_active, current_status)
            VALUES (?, ?, ?, ?, ?)`,
            [
                value.door_code,
                value.name,
                value.location || null,
                value.is_active,
                value.current_status,
            ]
        )

        return { id: result.insertId, ...value }
    },

    async getDoorById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${DOORS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async getDoorByCode(doorCode) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${DOORS_TABLE_NAME} WHERE door_code = ?`,
            [doorCode]
        )
        return rows[0] || null
    },

    async updateDoor(id, data) {
        const schema = DOORS_SCHEMA.fork(
            Object.keys(DOORS_SCHEMA.describe().keys),
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
            `UPDATE ${DOORS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )
        return this.getDoorById(id)
    },

    async deleteDoor(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${DOORS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listDoors(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${DOORS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { DOORS_TABLE_NAME, DOORS_SCHEMA, DoorsModel }
