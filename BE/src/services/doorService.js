import { DoorsModel } from '~/models/doorModel'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import crypto from 'crypto'

const generateDoorCode = () => {
    return 'DR-' + crypto.randomBytes(3).toString('hex').toUpperCase()
}

const addDoorService = async payload => {
    const existingDoors = await DoorsModel.listDoors(1000, 0)
    if (existingDoors.some(d => d.name === payload.name)) {
        throw new ApiError(StatusCodes.CONFLICT, 'Tên cửa đã tồn tại')
    }

    const door = await DoorsModel.createDoor({
        door_code: payload.door_code || generateDoorCode(),
        name: payload.name,
        location: payload.location || null,
        server_domain: payload.server_domain || null,
        is_active: payload.is_active !== undefined ? payload.is_active : true,
        current_status: payload.current_status || 'CLOSED',
    })

    return door
}

const updateDoorService = async (id, payload) => {
    const door = await DoorsModel.getDoorById(id)
    if (!door) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cửa không tồn tại')
    }

    if (payload.door_code) delete payload.door_code

    const updatedDoor = await DoorsModel.updateDoor(id, {
        ...payload,
        server_domain: payload.server_domain !== undefined ? payload.server_domain : door.server_domain
    })
    return updatedDoor
}

const deleteDoorService = async id => {
    const door = await DoorsModel.getDoorById(id)
    if (!door) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cửa không tồn tại')
    }

    const deleted = await DoorsModel.deleteDoor(id)
    return deleted
}

const listDoorsService = async (limit = 50, offset = 0) => {
    return await DoorsModel.listDoors(limit, offset)
}

const getDoorByIdService = async id => {
    const door = await DoorsModel.getDoorById(id)
    if (!door) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cửa không tồn tại')
    }
    return door
}

const getDoorByCodeService = async doorCode => {
    const door = await DoorsModel.getDoorByCode(doorCode)
    if (!door) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cửa không tồn tại')
    }
    return door
}

export const doorsService = {
    addDoorService,
    updateDoorService,
    deleteDoorService,
    listDoorsService,
    getDoorByIdService,
    getDoorByCodeService,
}