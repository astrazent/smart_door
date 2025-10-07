import express from 'express'
import { CardController } from '~/controllers/cardController'

const Router = express.Router()

// /v1/cards
Router.route('/')
    .get(CardController.getCards) 
    .post(CardController.createCard) 

// /v1/cards/:id
Router.route('/:id')
    .get(CardController.getCard) 
    .put(CardController.updateCard) 
    .delete(CardController.deleteCard) 

// /v1/cards/:id/move
Router.route('/:id/move').put(CardController.moveCard) 

export default Router
