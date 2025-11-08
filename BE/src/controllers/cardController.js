import { cardService } from '~/services/cardService.js'
import { StatusCodes } from 'http-status-codes'

const createCard = async (req, res, next) => {
    try {
        const data = await cardService.createCardService(req.body)
        return res.status(StatusCodes.CREATED).json({
            message: 'Tạo thẻ mới thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getCardById = async (req, res, next) => {
    try {
        const data = await cardService.getCardByIdService(req.params.id)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy thông tin thẻ thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getCardByUid = async (req, res, next) => {
    try {
        const data = await cardService.getCardByUidService(req.params.uid)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy thông tin thẻ theo UID thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateCard = async (req, res, next) => {
    try {
        const data = await cardService.updateCardService(
            req.params.id,
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật thẻ thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteCard = async (req, res, next) => {
    try {
        const data = await cardService.deleteCardService(req.params.id)
        return res.status(StatusCodes.OK).json({
            message: 'Xóa thẻ thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const listCards = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await cardService.listCardsService(limit, offset)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách thẻ thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}
const listCardsUser = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await cardService.listCardsUserService(limit, offset)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách thẻ thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const cardController = {
    createCard,
    getCardById,
    getCardByUid,
    updateCard,
    deleteCard,
    listCards,
    listCardsUser,
}
