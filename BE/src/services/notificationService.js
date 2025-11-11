import { NotificationModel } from '~/models/notificationModel'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

const createNotificationService = async payload => {
    if (!payload.title || !payload.message) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'title và message là bắt buộc'
        )
    }
    const notification = await NotificationModel.createNotification(payload)
    return notification
}

const getNotificationByIdService = async id => {
    const notification = await NotificationModel.getNotificationById(id)
    if (!notification) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy thông báo')
    }
    return notification
}

const updateNotificationService = async (id, data) => {
    const notification = await NotificationModel.getNotificationById(id)
    if (!notification) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy thông báo để cập nhật'
        )
    }
    const updated = await NotificationModel.updateNotification(id, data)
    return updated
}

const deleteNotificationService = async id => {
    const deleted = await NotificationModel.deleteNotification(id)
    if (!deleted) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy thông báo để xóa'
        )
    }
    return { message: 'Xóa thông báo thành công' }
}

const listNotificationsService = async (limit = 50, offset = 0) => {
    const notifications = await NotificationModel.listNotifications(
        limit,
        offset
    )
    return notifications
}

const listNotificationsByUserService = async (
    user_id,
    limit = 50,
    offset = 0
) => {
    const notifications = await NotificationModel.listNotifications(
        limit,
        offset
    )
    return notifications.filter(n => n.user_id === user_id)
}

export const notificationService = {
    createNotificationService,
    getNotificationByIdService,
    updateNotificationService,
    deleteNotificationService,
    listNotificationsService,
    listNotificationsByUserService,
}
