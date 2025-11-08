import { attendanceService } from '~/services/attendanceService.js'
import { StatusCodes } from 'http-status-codes'

const createAttendance = async (req, res, next) => {
    try {
        const data = await attendanceService.createAttendanceService(req.body)
        return res.status(StatusCodes.CREATED).json({
            message: 'Tạo bản ghi chấm công thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getAttendanceById = async (req, res, next) => {
    try {
        const data = await attendanceService.getAttendanceByIdService(
            req.params.id
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy thông tin attendance thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateAttendance = async (req, res, next) => {
    try {
        const data = await attendanceService.updateAttendanceService(
            req.params.id,
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật attendance thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteAttendance = async (req, res, next) => {
    try {
        const data = await attendanceService.deleteAttendanceService(
            req.params.id
        )
        return res.status(StatusCodes.OK).json({
            message: 'Xóa attendance thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const listAttendance = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await attendanceService.listAttendanceService(
            limit,
            offset
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách attendance thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const listAttendanceByUser = async (req, res, next) => {
    try {
        const user_id = parseInt(req.params.user_id)
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await attendanceService.listAttendanceByUserService(
            user_id,
            limit,
            offset
        )
        return res.status(StatusCodes.OK).json({
            message: `Lấy danh sách attendance của user ${user_id} thành công`,
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const attendanceController = {
    createAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    listAttendance,
    listAttendanceByUser,
}
