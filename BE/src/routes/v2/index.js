import express from 'express'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()

Router.get('/ping', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V2 are ready to use.' })
})

export const APIs_V2 = Router
