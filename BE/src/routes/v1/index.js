import express from 'express'
import historyRoute from './historyRoute'
import cardRoute from './cardRoute'
import doorRoute from './doorRoute'
import userRoute from './userRoute'
import espRoute from './espRoute'
import attendanceRoute from './attendanceRoute'
import notificationRoute from './notificationRoute'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()

Router.get('/ping', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

Router.use('/history', historyRoute)
Router.use('/card', cardRoute)
Router.use('/door', doorRoute)
Router.use('/user', userRoute)
Router.use('/esp', espRoute)
Router.use('/attendance', attendanceRoute)
Router.use('/notification', notificationRoute)
export const APIs_V1 = Router
