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

    async updateActionAdmin({ current_status, door, user = null, action }) {
        const conn = await getConnection()
        try {
            await conn.beginTransaction()
            const door_id = door.id
            await conn.execute(
                `UPDATE doors SET current_status = ?, last_updated = NOW() WHERE id = ?`,
                [current_status, door_id]
            )

            let action_message
            if (action == 'OPEN') {
                action_message = `mở ${door.name.toLowerCase()}`
            } else {
                action_message = `đóng ${door.name.toLowerCase()}`
            }
            const note = user ? `${user.full_name} ${action_message}` : null

            await conn.execute(
                `INSERT INTO history (door_id, user_id, action, door_status, time, note)
            VALUES (?, ?, ?, ?, NOW(), ?)`,
                [door_id, user?.id || null, action, current_status, note]
            )

            await conn.commit()
            return { success: true }
        } catch (err) {
            await conn.rollback()
            console.error('[Transaction ERROR]', err)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Cập nhật dữ liệu thất bại'
            )
        }
    },

    async updateStatusAdmin({ door_id, current_status }) {
        const conn = await getConnection()
        try {
            const [result] = await conn.execute(
                `UPDATE doors SET current_status = ?, last_updated = NOW() WHERE id = ?`,
                [current_status, door_id]
            )
            return { success: result.affectedRows > 0 }
        } catch (err) {
            console.error('[Update Door Status ERROR]', err)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Cập nhật trạng thái cửa thất bại'
            )
        }
    },

    async checkInDoor({ door, user }) {
        const conn = await getConnection()
        try {
            await conn.beginTransaction()

            const door_id = door.id
            const user_id = user.id
            const full_name = user.full_name
            const door_name = door.name.toLowerCase()

            await conn.execute(
                `UPDATE doors 
            SET is_active = TRUE, current_status = 'OPENED', last_updated = NOW() 
            WHERE id = ?`,
                [door_id]
            )

            const noteAttendance = `${full_name} đã vào ${door_name}`
            await conn.execute(
                `INSERT INTO attendance (user_id, door_id, check_in_time, note, status)
            VALUES (?, ?, NOW(), ?, 'CHECKED_IN')`,
                [user_id, door_id, noteAttendance]
            )

            const noteHistory = `${full_name} đã mở ${door_name}`
            await conn.execute(
                `INSERT INTO history (door_id, user_id, action, door_status, time, note)
            VALUES (?, ?, 'OPEN', 'OPENED', NOW(), ?)`,
                [door_id, user_id, noteHistory]
            )

            await conn.commit()
            return { success: true, message: 'Check-in cửa thành công' }
        } catch (err) {
            await conn.rollback()
            console.error('[Transaction ERROR - checkInDoor]', err)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Check-in cửa thất bại'
            )
        }
    },

    async checkOutDoor({ door, user }) {
        const conn = await getConnection()
        try {
            await conn.beginTransaction()

            const door_id = door.id
            const user_id = user.id
            const full_name = user.full_name
            const door_name = door.name.toLowerCase()

            await conn.execute(
                `UPDATE doors 
            SET is_active = FALSE, current_status = 'CLOSED', last_updated = NOW() 
            WHERE id = ?`,
                [door_id]
            )

            const [rows] = await conn.execute(
                `SELECT id FROM attendance 
            WHERE user_id = ? AND door_id = ? AND status = 'CHECKED_IN'
            ORDER BY check_in_time DESC LIMIT 1`,
                [user_id, door_id]
            )

            if (rows.length > 0) {
                const attendance_id = rows[0].id
                const noteAttendance = `${full_name} đã rời khỏi ${door_name}`
                await conn.execute(
                    `UPDATE attendance 
                SET check_out_time = NOW(), status = 'CHECKED_OUT', note = ?
                WHERE id = ?`,
                    [noteAttendance, attendance_id]
                )
            } else {
                console.warn(
                    `[checkOutDoor] Không tìm thấy bản ghi CHECKED_IN của user ${user_id}`
                )
            }

            const noteHistory = `${full_name} đã đóng ${door_name}`
            await conn.execute(
                `INSERT INTO history (door_id, user_id, action, door_status, time, note)
            VALUES (?, ?, 'CLOSE', 'CLOSED', NOW(), ?)`,
                [door_id, user_id, noteHistory]
            )

            await conn.commit()
            return { success: true, message: 'Check-out cửa thành công' }
        } catch (err) {
            await conn.rollback()
            console.error('[Transaction ERROR - checkOutDoor]', err)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Check-out cửa thất bại'
            )
        }
    },
    async checkInInvalid({ door, user }) {
        const conn = await getConnection()
        try {
            await conn.beginTransaction()

            const door_id = door.id
            const user_id = user?.id || null
            const full_name = user?.full_name || 'Người dùng không xác định'
            const door_name = door.name.toLowerCase()

            const noteHistory = `${full_name} đã check-in ${door_name} không thành công`
            await conn.execute(
                `INSERT INTO history (door_id, user_id, action, door_status, time, note)
            VALUES (?, ?, 'FAILED', 'CLOSED', NOW(), ?)`,
                [door_id, user_id, noteHistory]
            )

            const title = 'Cảnh báo truy cập'
            const message = `${full_name} đã check-in ${door_name} không thành công`
            await conn.execute(
                `INSERT INTO notifications (user_id, door_id, title, message, type, is_read, created_at)
            VALUES (?, ?, ?, ?, 'ACCESS', FALSE, NOW())`,
                [user_id, door_id, title, message]
            )

            await conn.commit()
            return {
                success: true,
                message:
                    'Người dùng check-in không thành công, đã ghi nhận vào hệ thống',
            }
        } catch (err) {
            await conn.rollback()
            console.error('[Transaction ERROR - checkInInvalid]', err)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Ghi nhận check-in không thành công thất bại'
            )
        }
    },

    async checkOutInvalid({ door, user }) {
        const conn = await getConnection()
        try {
            await conn.beginTransaction()

            const door_id = door.id
            const user_id = user?.id || null
            const full_name = user?.full_name || 'Người dùng không xác định'
            const door_name = door.name.toLowerCase()

            const noteHistory = `${full_name} đã check-out ${door_name} không thành công`
            await conn.execute(
                `INSERT INTO history (door_id, user_id, action, door_status, time, note)
            VALUES (?, ?, 'FAILED', 'OPENED', NOW(), ?)`,
                [door_id, user_id, noteHistory]
            )

            const title = 'Cảnh báo truy cập'
            const message = `${full_name} đã check-out ${door_name} không thành công`
            await conn.execute(
                `INSERT INTO notifications (user_id, door_id, title, message, type, is_read, created_at)
            VALUES (?, ?, ?, ?, 'ACCESS', FALSE, NOW())`,
                [user_id, door_id, title, message]
            )

            await conn.commit()
            return {
                success: true,
                message:
                    'Người dùng check-out không thành công, đã ghi nhận vào hệ thống',
            }
        } catch (err) {
            await conn.rollback()
            console.error('[Transaction ERROR - checkOutInvalid]', err)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Ghi nhận check-out không thành công thất bại'
            )
        }
    },
    async goOutDoor({ door, user = null }) {
        const conn = await getConnection()
        try {
            await conn.beginTransaction()

            const door_id = door.id
            const user_id = user?.id || null
            const full_name = user?.full_name || 'Người dùng không xác định'
            const door_name = door.name.toLowerCase()

            // 1. Cập nhật trạng thái cửa mở
            await conn.execute(
                `UPDATE doors SET current_status = 'OPENED', last_updated = NOW() WHERE id = ?`,
                [door_id]
            )

            // 2. Thêm vào bảng history
            const noteHistory = `${full_name} đã mở ${door_name}`
            await conn.execute(
                `INSERT INTO history (door_id, user_id, action, door_status, time, note)
            VALUES (?, ?, 'OPEN', 'OPENED', NOW(), ?)`,
                [door_id, user_id, noteHistory]
            )

            await conn.commit()
            return {
                success: true,
                message: 'Cập nhật trạng thái cửa mở thành công',
            }
        } catch (err) {
            await conn.rollback()
            console.error('[Transaction ERROR - goOutDoor]', err)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Cập nhật trạng thái cửa mở thất bại'
            )
        }
    },
    async doorClose({ door, user = null }) {
        const conn = await getConnection()
        try {
            await conn.beginTransaction()

            const door_id = door.id
            const user_id = user?.id || null
            const full_name = user?.full_name || 'Người dùng không xác định'
            const door_name = door.name.toLowerCase()

            // 1. Cập nhật trạng thái cửa đóng
            await conn.execute(
                `UPDATE doors SET current_status = 'CLOSED', last_updated = NOW() WHERE id = ?`,
                [door_id]
            )

            // 2. Thêm vào bảng history
            const noteHistory = `${full_name} đã đóng ${door_name}`
            await conn.execute(
                `INSERT INTO history (door_id, user_id, action, door_status, time, note)
            VALUES (?, ?, 'CLOSE', 'CLOSED', NOW(), ?)`,
                [door_id, user_id, noteHistory]
            )

            await conn.commit()
            return {
                success: true,
                message: 'Cập nhật trạng thái cửa đóng thành công',
            }
        } catch (err) {
            await conn.rollback()
            console.error('[Transaction ERROR - doorClose]', err)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Cập nhật trạng thái cửa đóng thất bại'
            )
        }
    },
}

export { HISTORY_TABLE_NAME, HISTORY_SCHEMA, HistoryModel }
