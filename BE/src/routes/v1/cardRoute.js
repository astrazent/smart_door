import express from 'express'
import { cardController } from '~/controllers/cardController.js'

const router = express.Router()

router.post('/', cardController.createCard)

router.get('/', cardController.listCards)

router.get('/card_user', cardController.listCardsUser)

router.get('/:id', cardController.getCardById)

router.get('/uid/:uid', cardController.getCardByUid)

router.patch('/:id', cardController.updateCard)

router.delete('/:id', cardController.deleteCard)

export default router
