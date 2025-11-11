import { doorsService } from '~/services/doorService'
import { StatusCodes } from 'http-status-codes'

const addDoor = async (req, res, next) => {
    try {
        const data = await doorsService.addDoorService(req.body)
        return res.status(StatusCodes.CREATED).json({
            message: 'Thêm cửa thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateDoor = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const data = await doorsService.updateDoorService(id, req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật cửa thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteDoor = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const deleted = await doorsService.deleteDoorService(id)
        return res.status(StatusCodes.OK).json({
            message: deleted ? 'Xóa cửa thành công' : 'Không xóa được cửa',
        })
    } catch (error) {
        next(error)
    }
}

const listDoors = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await doorsService.listDoorsService(limit, offset)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách cửa thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getDoorById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const data = await doorsService.getDoorByIdService(id)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy thông tin cửa thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getDoorByCode = async (req, res, next) => {
    try {
        const { door_code } = req.params
        const data = await doorsService.getDoorByCodeService(door_code)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy thông tin cửa thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const doorsController = {
    addDoor,
    updateDoor,
    deleteDoor,
    listDoors,
    getDoorById,
    getDoorByCode,
}
