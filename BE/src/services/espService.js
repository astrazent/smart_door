import { DoorsModel } from '~/models/doorModel'
import { UsersModel } from '~/models/userModel' // nếu bạn có bảng users riêng
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

    const url = `http://${server_domain}/${action}`

    try {
        const res = await axios.post(url, payload, { timeout: 5000 }) // timeout 5s
        return res.data
    } catch (err) {
        console.error('[ESP ERROR]', err.message)
        throw new ApiError(StatusCodes.BAD_GATEWAY, `Không thể kết nối tới cửa (${server_domain})`)
    }
}

/**
 * Tìm người dùng bằng UID RFID
 */
const findUserByUID = async (uid, user = null) => {
    const foundUser = await UsersModel.findByUID(uid)
    // Nếu muốn filter theo user id
    if (user?.id && foundUser && foundUser.id !== user.id) return null
    return foundUser || null
}
const sanitizeName = (name) => {
    // 1. Loại bỏ dấu tiếng Việt
    let cleanName = removeAccents(name);

    // 2. Loại bỏ tất cả ký tự không phải chữ cái hoặc số, giữ khoảng trắng
    cleanName = cleanName.replace(/[^a-zA-Z0-9 ]/g, '');

    // 3. Loại bỏ khoảng trắng thừa
    cleanName = cleanName.replace(/\s+/g, ' ').trim();

    return cleanName;
};

const cardListService = async (limit, offset) => {
    const cards = await CardsModel.listCardsESP(limit, offset);

    // format toàn bộ name
    const formattedCards = cards.map(card => ({
        ...card,
        name: sanitizeName(card.name)
    }));

    return formattedCards;
};

/**
 * Mở cửa
 */
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
    console.log("check");
    return formatResponse('success', 'Cửa đã được mở', door_code)
}

/**
 * Đóng cửa
 */
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

/**
 * Lấy trạng thái cửa hiện tại
 */
const getDoorStatusService = async (door_code) => {
    const door = await DoorsModel.getDoorByCode(door_code)
    if (!door) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cửa')

    const espResponse = await sendRequestToDoorServer(door.server_domain, 'status')

    if (espResponse.door_code !== door.door_code) {
        throw new ApiError(StatusCodes.CONFLICT, 'door_code trả về từ ESP không khớp với DB')
    }

    // Cập nhật trực tiếp trạng thái cửa
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
    formatResponse,
}