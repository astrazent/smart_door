import express from 'express'
import { notificationController } from '~/controllers/notificationController.js'

const router = express.Router()

router.post('/', notificationController.createNotification)

router.get('/', notificationController.listNotifications)

router.get('/user/:user_id', notificationController.listNotificationsByUser)

router.get('/:id', notificationController.getNotificationById)

router.patch('/:id', notificationController.updateNotification)

router.delete('/:id', notificationController.deleteNotification)

export default router
