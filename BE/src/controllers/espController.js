import { espService } from '~/services/espService.js'
import { StatusCodes } from 'http-status-codes'

const DOOR_CODE = 'DOOR_MAIN'

const checkCard = async (req, res, next) => {
    try {
        const uid = (req.query.uid || '').replace(/\s+/g, '').toUpperCase()
        const user = req.user
        if (!uid)
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Missing UID' })

        const foundUser = await espService.findUserByUID(uid, user)
        if (foundUser) {
            await espService.addLog({
                uid,
                action: 'scan',
                timestamp: new Date(),
                door_code: DOOR_CODE,
                user,
            })
            const data = espService.formatResponse(
                'success',
                `Người dùng ${foundUser.name} hợp lệ`,
                DOOR_CODE
            )
            return res.status(StatusCodes.OK).json({
                message: 'UID hợp lệ',
                data,
            })
        }
        const data = espService.formatResponse(
            'fail',
            'UID không hợp lệ',
            DOOR_CODE
        )
        return res.status(StatusCodes.OK).json({
            message: 'UID không hợp lệ',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getCardListESP = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await espService.cardListService(limit, offset)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách thẻ thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const openDoor = async (req, res, next) => {
    try {
        const user = req.user
        const data = await espService.openDoorService(DOOR_CODE, user)
        return res.status(StatusCodes.OK).json({
            message: 'Mở cửa thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const closeDoor = async (req, res, next) => {
    try {
        const user = req.user
        const data = await espService.closeDoorService(DOOR_CODE, user)
        return res.status(StatusCodes.OK).json({
            message: 'Đóng cửa thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getStatus = async (req, res, next) => {
    try {
        const data = await espService.getDoorStatusService(DOOR_CODE)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy trạng thái cửa thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const checkInDoorESP = async (req, res, next) => {
    try {
        const result = await espService.checkInDoorService(req)
        return res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}

const CheckInInvalidESP = async (req, res, next) => {
    try {
        const result = await espService.checkInInvalidService(req)
        return res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}

const checkOutDoorESP = async (req, res, next) => {
    try {
        const result = await espService.checkOutDoorService(req)
        return res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}

const CheckOutInvalidESP = async (req, res, next) => {
    try {
        const result = await espService.checkOutInvalidService(req)
        return res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}

const goOutDoorESP = async (req, res, next) => {
    try {
        const result = await espService.goOutDoorService(req)
        return res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}
const doorCloseESP = async (req, res, next) => {
    try {
        const result = await espService.doorCloseService(req)
        return res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}

export const espController = {
    checkCard,
    getCardListESP,
    checkInDoorESP,
    CheckInInvalidESP,
    checkOutDoorESP,
    CheckInInvalidESP,
    CheckOutInvalidESP,
    goOutDoorESP,
    doorCloseESP,
    openDoor,
    closeDoor,
    getStatus,
}
