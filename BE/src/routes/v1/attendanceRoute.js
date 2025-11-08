import express from 'express'
import { attendanceController } from '~/controllers/attendanceController.js'

const router = express.Router()

router.post('/', attendanceController.createAttendance)

router.get('/', attendanceController.listAttendance)

router.get('/user/:user_id', attendanceController.listAttendanceByUser)

router.get('/:id', attendanceController.getAttendanceById)

router.patch('/:id', attendanceController.updateAttendance)

router.delete('/:id', attendanceController.deleteAttendance)

export default router
