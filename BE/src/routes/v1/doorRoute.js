import express from 'express'
import { doorsController } from '~/controllers/doorController'

const router = express.Router()

router.get('/', doorsController.listDoors)

router.post('/', doorsController.addDoor)

router.get('/:id', doorsController.getDoorById)

router.get('/code/:door_code', doorsController.getDoorByCode)

router.patch('/:id', doorsController.updateDoor)

router.delete('/:id', doorsController.deleteDoor)

export default router
