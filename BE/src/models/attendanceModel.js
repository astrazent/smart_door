import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const ATTENDANCE_TABLE_NAME = 'attendance'

const ATTENDANCE_SCHEMA = Joi.object({
    user_id: Joi.number().integer().required().messages({
        'any.required': 'user_id là bắt buộc',
        'number.base': 'user_id phải là số nguyên',
    }),
    door_id: Joi.number().integer().allow(null).messages({
        'number.base': 'door_id phải là số nguyên',
    }),
    check_in_time: Joi.date().optional().messages({
        'date.base': 'check_in_time phải là kiểu ngày giờ',
    }),
    check_out_time: Joi.date().optional().messages({
        'date.base': 'check_out_time phải là kiểu ngày giờ',
    }),
    status: Joi.string()
        .valid('CHECKED_IN', 'CHECKED_OUT')
        .default('CHECKED_IN'),
    note: Joi.string().max(255).allow(null, ''),
})

const AttendanceModel = {
    async createAttendance(data) {
        const { error, value } = ATTENDANCE_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${ATTENDANCE_TABLE_NAME} 
            (user_id, door_id, check_in_time, check_out_time, status, note)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                value.user_id,
                value.door_id || null,
                value.check_in_time || null,
                value.check_out_time || null,
                value.status,
                value.note || null,
            ]
        )
        return { id: result.insertId, ...value }
    },

    async getAttendanceById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${ATTENDANCE_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updateAttendance(id, data) {
        const schema = ATTENDANCE_SCHEMA.fork(
            Object.keys(ATTENDANCE_SCHEMA.describe().keys),
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
            `UPDATE ${ATTENDANCE_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )
        return this.getAttendanceById(id)
    },

    async deleteAttendance(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${ATTENDANCE_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listAttendance(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT a.*, 
                    u.full_name AS user_name, 
                    d.name AS door_name 
            FROM ${ATTENDANCE_TABLE_NAME} a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN doors d ON a.door_id = d.id
            ORDER BY a.id DESC
            LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { ATTENDANCE_TABLE_NAME, ATTENDANCE_SCHEMA, AttendanceModel }
