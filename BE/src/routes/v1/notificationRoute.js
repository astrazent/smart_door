import express from 'express'
import { notificationController } from '~/controllers/notificationController.js'

const router = express.Router()

// Tạo thông báo mới
router.post('/', notificationController.createNotification)

// Lấy danh sách tất cả thông báo
router.get('/', notificationController.listNotifications)

// Lấy danh sách thông báo theo user
router.get('/user/:user_id', notificationController.listNotificationsByUser)

// Lấy chi tiết một thông báo theo ID
router.get('/:id', notificationController.getNotificationById)

// Cập nhật (ví dụ: đánh dấu đã đọc)
router.patch('/:id', notificationController.updateNotification)

// Xóa thông báo
router.delete('/:id', notificationController.deleteNotification)

export default router