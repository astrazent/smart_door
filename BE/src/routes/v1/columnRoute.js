import express from 'express'
import { ColumnController } from '~/controllers/columnController'

const Router = express.Router()

// /v1/columns
Router.route('/')
    .get(ColumnController.getColumns) 
    .post(ColumnController.createColumn) 

// /v1/columns/:id
Router.route('/:id')
    .put(ColumnController.updateColumn) 
    .delete(ColumnController.deleteColumn) 

export default Router
