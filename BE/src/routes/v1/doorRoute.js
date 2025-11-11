import express from 'express'
import { doorsController } from '~/controllers/doorController'

const router = express.Router()

// Lấy danh sách cửa
router.get('/', doorsController.listDoors)

// Thêm cửa mới
router.post('/', doorsController.addDoor)

// Lấy thông tin cửa theo ID
router.get('/:id', doorsController.getDoorById)

// Lấy thông tin cửa theo door_code
router.get('/code/:door_code', doorsController.getDoorByCode)

// Cập nhật cửa
router.patch('/:id', doorsController.updateDoor)

// Xóa cửa
router.delete('/:id', doorsController.deleteDoor)

export default router