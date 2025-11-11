import express from 'express'
import { espController } from '~/controllers/espController'

const router = express.Router()

// ESP gửi UID RFID để xác thực
router.get('/check-card', espController.checkCard)

// Web gửi lệnh điều khiển cửa
router.get('/door/open', espController.openDoor)

router.get('/door/close', espController.closeDoor)

// Web (hoặc admin) lấy trạng thái cửa mới nhất
router.get('/door/status', espController.getStatus)

router.get('/get-card-esp', espController.getCardListESP)

router.post('/check-in-esp', espController.checkInDoorESP)

router.post('/check-in-invalid-esp', espController.CheckInInvalidESP)

router.post('/check-out-esp', espController.checkOutDoorESP)

router.post('/check-out-invalid-esp', espController.CheckOutInvalidESP)

router.post('/go-out-door-esp', espController.goOutDoorESP)

router.post('/door-closed-esp', espController.doorCloseESP)

export default router
