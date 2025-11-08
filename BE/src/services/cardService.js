import { CardsModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createCardService = async payload => {
    const existed = await CardsModel.getCardByUid(payload.card_uid)
    if (existed) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            'Thẻ đã tồn tại trong hệ thống'
        )
    }
    const card = await CardsModel.createCard(payload)
    return card
}

const getCardByIdService = async id => {
    const card = await CardsModel.getCardById(id)
    if (!card) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy thẻ')
    }
    return card
}

const getCardByUidService = async card_uid => {
    const card = await CardsModel.getCardByUid(card_uid)
    if (!card) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy thẻ')
    }
    return card
}

const updateCardService = async (id, data) => {
    const card = await CardsModel.getCardById(id)
    if (!card) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy thẻ để cập nhật'
        )
    }
    const updated = await CardsModel.updateCard(id, data)
    return updated
}

const deleteCardService = async id => {
    const deleted = await CardsModel.deleteCard(id)
    if (!deleted) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy thẻ để xóa')
    }
    return { message: 'Xóa thẻ thành công' }
}

const listCardsService = async (limit, offset) => {
    const cards = await CardsModel.listCards(limit, offset)
    return cards
}

const listCardsUserService = async (limit, offset) => {
    const cards = await CardsModel.listCardsUser(limit, offset)
    return cards
}

export const cardService = {
    createCardService,
    getCardByIdService,
    getCardByUidService,
    updateCardService,
    deleteCardService,
    listCardsService,
    listCardsUserService,
}
