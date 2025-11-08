import { HistoryModel } from '~/models/historyModel.js'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

const addHistoryService = async payload => {
    const history = await HistoryModel.createHistory({
        door_id: payload.door_id,
        user_id: payload.user_id || null,
        card_id: payload.card_id || null,
        action: payload.action,
        door_status: payload.door_status,
        time: payload.time || new Date(),
        note: payload.note || null,
    })

    return history
}

const listHistoryService = async (limit = 50, offset = 0) => {
    return await HistoryModel.listHistory(limit, offset)
}

const listHistoryDoorUserService = async (limit = 50, offset = 0) => {
    return await HistoryModel.listHistoryDoorUser(limit, offset)
}

const deleteHistoryService = async id => {
    const history = await HistoryModel.getHistoryById(id)
    if (!history) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Lịch sử không tồn tại')
    }

    const deleted = await HistoryModel.deleteHistory(id)
    return deleted
}

const deleteAllHistoryService = async () => {
    const deletedCount = await HistoryModel.deleteAllHistory()
    return deletedCount
}

export const historyService = {
    addHistoryService,
    listHistoryService,
    listHistoryDoorUserService,
    deleteHistoryService,
    deleteAllHistoryService,
}
