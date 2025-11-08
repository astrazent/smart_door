import express from 'express'
import { historyController } from '~/controllers/historyController.js'

const router = express.Router()

router.get('/', historyController.listHistory)

router.get('/list_door_user', historyController.listHistoryDoorUser)

router.post('/', historyController.addHistory)

router.delete('/:id', historyController.deleteHistory)

router.delete('/', historyController.deleteAllHistory)

export default router
