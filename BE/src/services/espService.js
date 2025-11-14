import { DoorsModel } from '~/models/doorModel'
import { UsersModel } from '~/models/userModel' 
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { HistoryModel } from '~/models/historyModel'
import { CardsModel } from '~/models/cardModel'
import removeAccents from 'remove-accents';
import axios from 'axios'

const sendRequestToDoorServer = async (server_domain, action, payload = {}) => {
    if (!server_domain) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing server_domain')
    }
    
    const url = `http://${server_domain}/api/${action}`
    console.log(url);
    try {
        const res = await axios.get(url, payload, { timeout: 5000 }) 
        return res.data
    } catch (err) {
        console.error('[ESP ERROR]', err.message)
        throw new ApiError(StatusCodes.BAD_GATEWAY, `Không thể kết nối tới cửa (${server_domain})`)
    }
}


const findUserByUID = async (uid, user = null) => {
    const foundUser = await UsersModel.findByUID(uid)
    
    if (user?.id && foundUser && foundUser.id !== user.id) return null
    return foundUser || null
}
const sanitizeName = (name) => {
    
    let cleanName = removeAccents(name);

    
    cleanName = cleanName.replace(/[^a-zA-Z0-9 ]/g, '');

    
    cleanName = cleanName.replace(/\s+/g, ' ').trim();

    return cleanName;
};

const cardListService = async (limit, offset) => {
    const cards = await CardsModel.listCardsESP(limit, offset);

    
    const formattedCards = cards.map(card => ({
        ...card,
        name: sanitizeName(card.name)
    }));

    return formattedCards;
};


const openDoorService = async (door_code, user = null) => {
    const door = await DoorsModel.getDoorByCode(door_code)
    if (!door) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cửa')

    const espResponse = await sendRequestToDoorServer(door.server_domain, 'door/open')

    if (espResponse.door_code !== door.door_code) {
        throw new ApiError(StatusCodes.CONFLICT, 'door_code trả về từ ESP không khớp với DB')
    }

    await HistoryModel.updateActionAdmin({
        current_status: espResponse.status,
        door: door,
        user: user || null,
        action: 'OPEN'
    })
    return formatResponse('success', 'Cửa đã được mở', door_code)
}


const closeDoorService = async (door_code, user = null) => {
    const door = await DoorsModel.getDoorByCode(door_code)
    if (!door) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cửa')

    const espResponse = await sendRequestToDoorServer(door.server_domain, 'door/close')

    if (espResponse.door_code !== door.door_code) {
        throw new ApiError(StatusCodes.CONFLICT, 'door_code trả về từ ESP không khớp với DB')
    }

    await HistoryModel.updateActionAdmin({
        current_status: espResponse.status,
        door: door,
        user: user || null,
        action: 'CLOSE'
    })

    return formatResponse('success', 'Cửa đã được đóng', door_code)
}


const getDoorStatusService = async (door_code) => {
    const door = await DoorsModel.getDoorByCode(door_code)
    if (!door) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cửa')

    
    const espPromise = sendRequestToDoorServer(door.server_domain, 'status')

    
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new ApiError(StatusCodes.GATEWAY_TIMEOUT, `ESP server không phản hồi sau 2 giây (${door.server_domain})`))
        }, 2000)
    })

    
    const espResponse = await Promise.race([espPromise, timeoutPromise])

    if (espResponse.door_code !== door.door_code) {
        throw new ApiError(StatusCodes.CONFLICT, 'door_code trả về từ ESP không khớp với DB')
    }

    
    const result = await HistoryModel.updateStatusAdmin({
        door_id: door.id,
        current_status: espResponse.status.toUpperCase()
    })

    if (!result.success) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lấy trạng thái cửa thất bại')
    }

    return formatResponse('success', 'Đã lấy trạng thái cửa', door_code, {
        current_status: espResponse.status.toUpperCase()
    })
}

const checkInDoorService = async (req) => {
    const { uid, door_code } = req.body
    if (!uid || !door_code) throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu thông tin UID hoặc door_code')

    const user = await UsersModel.getUserByUid(uid)
    const door = await DoorsModel.getDoorByCode(door_code)

    return await HistoryModel.checkInDoor({ door, user })
}

const checkOutDoorService = async (req) => {
    const { uid, door_code } = req.body
    if (!uid || !door_code) throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu thông tin UID hoặc door_code')

    const user = await UsersModel.getUserByUid(uid)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user với UID này')

    const door = await DoorsModel.getDoorByCode(door_code)
    if (!door) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cửa với door_code này')

    return await HistoryModel.checkOutDoor({ door, user })
}

const checkInInvalidService = async (req) => {
    const { door_code, uid = null } = req.body
    if (!door_code) throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu thông tin door_code')

    const user = uid ? await UsersModel.getUserByUid(uid) : null
    const door = await DoorsModel.getDoorByCode(door_code)
    if (!door) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cửa với door_code này')

    return await HistoryModel.checkInInvalid({ door, user })
}

const checkOutInvalidService = async (req) => {
    const { door_code, uid = null } = req.body
    if (!door_code) throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu thông tin door_code')

    const user = uid ? await UsersModel.getUserByUid(uid) : null
    const door = await DoorsModel.getDoorByCode(door_code)
    if (!door) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cửa với door_code này')

    return await HistoryModel.checkOutInvalid({ door, user })
}

const goOutDoorService = async (req) => {
    const { door_code, uid = null } = req.body
    if (!door_code) throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu thông tin door_code')

    const user = uid ? await UsersModel.getUserByUid(uid) : null
    const door = await DoorsModel.getDoorByCode(door_code)
    if (!door) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cửa với door_code này')

    return await HistoryModel.goOutDoor({ door, user })
}

const doorCloseService = async (req) => {
    const { door_code, uid = null } = req.body
    if (!door_code) throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu thông tin door_code')

    const user = uid ? await UsersModel.getUserByUid(uid) : null
    const door = await DoorsModel.getDoorByCode(door_code)
    if (!door) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cửa với door_code này')

    return await HistoryModel.doorClose({ door, user })
}

const getNewCardService = async (door_code) => {
    if (!door_code) throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu thông tin door_code')

    const door = await DoorsModel.getDoorByCode(door_code)
    if (!door) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cửa với door_code này')

    
    const espPromise = sendRequestToDoorServer(door.server_domain, 'get-card-uid')

    
    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 'error',
                message: 'ESP server không phản hồi sau 10 giây',
                uid: null,
                door_code: door_code
            })
        }, 10000)
    })

    
    const espResponse = await Promise.race([espPromise, timeoutPromise])

    
    if (espResponse.status === 'error') {
        return espResponse
    }

    
    if (!espResponse?.uid) {
        throw new ApiError(StatusCodes.BAD_GATEWAY, 'ESP server không trả về UID')
    }

    return espResponse
}

const createNewCardService = async (payload) => {
    const { card_uid, user_id } = payload

    if (!card_uid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu card_uid')
    }

    
    const existed = await CardsModel.getCardByUid(card_uid)
    if (existed) {
        throw new ApiError(StatusCodes.CONFLICT, 'Thẻ đã tồn tại trong hệ thống')
    }

    
    const cardData = {
        card_uid,
        user_id: user_id || null,
        is_active: true, 
        registered_at: new Date(),
    }

    const card = await CardsModel.createCard(cardData)
    return card
}

const formatResponse = (status, message, door_code, extra = {}) => ({
    status,
    message,
    door_code,
    ...extra,
})

export const espService = {
    findUserByUID,
    cardListService,
    checkInDoorService,
    checkInInvalidService,
    checkOutDoorService,
    checkOutInvalidService,
    goOutDoorService,
    doorCloseService,
    openDoorService,
    closeDoorService,
    getDoorStatusService,
    createNewCardService,
    getNewCardService,
    formatResponse,
}