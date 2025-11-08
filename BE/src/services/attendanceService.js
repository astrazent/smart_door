import { AttendanceModel } from '~/models/attendanceModel.js'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

const createAttendanceService = async payload => {
    if (!payload.user_id) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'user_id là bắt buộc')
    }
    const attendance = await AttendanceModel.createAttendance(payload)
    return attendance
}

const getAttendanceByIdService = async id => {
    const attendance = await AttendanceModel.getAttendanceById(id)
    if (!attendance) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy bản ghi attendance'
        )
    }
    return attendance
}

const updateAttendanceService = async (id, data) => {
    const attendance = await AttendanceModel.getAttendanceById(id)
    if (!attendance) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy bản ghi attendance để cập nhật'
        )
    }
    const updated = await AttendanceModel.updateAttendance(id, data)
    return updated
}

const deleteAttendanceService = async id => {
    const deleted = await AttendanceModel.deleteAttendance(id)
    if (!deleted) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy bản ghi attendance để xóa'
        )
    }
    return { message: 'Xóa attendance thành công' }
}

const listAttendanceService = async (limit = 50, offset = 0) => {
    const attendances = await AttendanceModel.listAttendance(limit, offset)
    return attendances
}

const listAttendanceByUserService = async (user_id, limit = 50, offset = 0) => {
    const attendances = await AttendanceModel.listAttendance(limit, offset)

    return attendances.filter(a => a.user_id === user_id)
}

export const attendanceService = {
    createAttendanceService,
    getAttendanceByIdService,
    updateAttendanceService,
    deleteAttendanceService,
    listAttendanceService,
    listAttendanceByUserService,
}
