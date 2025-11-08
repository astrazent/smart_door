import express from 'express'
import { doorsController } from '~/controllers/doorController'

const router = express.Router()

router.get('/', doorsController.listDoors)

router.post('/', doorsController.addDoor)

router.patch('/:id', doorsController.updateDoor)

router.delete('/:id', doorsController.deleteDoor)

export default router
