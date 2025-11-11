import express from 'express'
import { espController } from '~/controllers/espController'
import { verifyAccessToken } from '~/utils/token'
const router = express.Router()

router.get('/check-card', espController.checkCard)

router.get('/door/open', espController.openDoor)

router.get('/door/close', espController.closeDoor)

router.get('/door/status', espController.getStatus)

router.get('/get-new-card', espController.getNewCard)

router.post('/save-new-card', espController.saveNewCard)

router.get('/get-card-esp', espController.getCardListESP)

router.post('/check-in-esp', espController.checkInDoorESP)

router.post('/check-in-invalid-esp', espController.CheckInInvalidESP)

router.post('/check-out-esp', espController.checkOutDoorESP)

router.post('/check-out-invalid-esp', espController.CheckOutInvalidESP)

router.post('/go-out-door-esp', espController.goOutDoorESP)

router.post('/door-closed-esp', espController.doorCloseESP)

export default router
