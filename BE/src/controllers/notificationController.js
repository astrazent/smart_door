import { notificationService } from '~/services/notificationService'
import { StatusCodes } from 'http-status-codes'

const createNotification = async (req, res, next) => {
    try {
        const data = await notificationService.createNotificationService(
            req.body
        )
        return res.status(StatusCodes.CREATED).json({
            message: 'Tạo thông báo thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getNotificationById = async (req, res, next) => {
    try {
        const data = await notificationService.getNotificationByIdService(
            req.params.id
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy thông tin thông báo thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateNotification = async (req, res, next) => {
    try {
        const data = await notificationService.updateNotificationService(
            req.params.id,
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật thông báo thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteNotification = async (req, res, next) => {
    try {
        const data = await notificationService.deleteNotificationService(
            req.params.id
        )
        return res.status(StatusCodes.OK).json({
            message: 'Xóa thông báo thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const listNotifications = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await notificationService.listNotificationsService(
            limit,
            offset
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách thông báo thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const listNotificationsByUser = async (req, res, next) => {
    try {
        const user_id = parseInt(req.params.user_id)
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await notificationService.listNotificationsByUserService(
            user_id,
            limit,
            offset
        )
        return res.status(StatusCodes.OK).json({
            message: `Lấy danh sách thông báo của user ${user_id} thành công`,
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const notificationController = {
    createNotification,
    getNotificationById,
    updateNotification,
    deleteNotification,
    listNotifications,
    listNotificationsByUser,
}
