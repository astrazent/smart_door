import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
const Router = express.Router()

// /v1/boards
Router.route('/')
    
    .post(boardValidation.createBoard, boardController.createBoard) 

// /v1/boards/:id
// Router.route('/:id')




export default Router
