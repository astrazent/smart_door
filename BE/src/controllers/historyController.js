import { historyService } from '~/services/historyService.js'
import { StatusCodes } from 'http-status-codes'

const addHistory = async (req, res, next) => {
    try {
        const data = await historyService.addHistoryService(req.body)
        return res.status(StatusCodes.CREATED).json({
            message: 'Thêm lịch sử thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const listHistory = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await historyService.listHistoryService(limit, offset)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách lịch sử thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}
const listHistoryDoorUser = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await historyService.listHistoryDoorUserService(
            limit,
            offset
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách lịch sử thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteHistory = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const deleted = await historyService.deleteHistoryService(id)
        return res.status(StatusCodes.OK).json({
            message: deleted ? 'Xóa lịch sử thành công' : 'Không xóa được',
        })
    } catch (error) {
        next(error)
    }
}

const deleteAllHistory = async (req, res, next) => {
    try {
        const deletedCount = await historyService.deleteAllHistoryService()
        return res.status(StatusCodes.OK).json({
            message: `Đã xóa ${deletedCount} bản ghi lịch sử`,
        })
    } catch (error) {
        next(error)
    }
}

export const historyController = {
    addHistory,
    listHistory,
    listHistoryDoorUser,
    deleteHistory,
    deleteAllHistory,
}
