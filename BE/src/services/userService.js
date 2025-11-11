import { UsersModel } from '~/models/userModel.js'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs/dist/bcrypt'
import { createAccessToken } from '~/utils/token'

const registerService = async payload => {
    const existedUsername = await UsersModel.getUserByUsername(payload.username)
    if (existedUsername) {
        throw new ApiError(StatusCodes.CONFLICT, 'Username đã tồn tại')
    }
    if (payload.email) {
        const existedEmail = await UsersModel.getUserByEmail(payload.email)
        if (existedEmail) {
            throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại')
        }
    }

    if (!payload.password) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Password không được để trống'
        )
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10)
    payload.password_hash = hashedPassword
    delete payload.password

    const user = await UsersModel.createUser(payload)
    return user
}

const loginService = async (identifier, password) => {
    let user = await UsersModel.getUserByUsername(identifier)
    if (!user) user = await UsersModel.getUserByEmail(identifier)
    if (!user)
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Username hoặc email không tồn tại'
        )

    // Kiểm tra role
    if (user.role !== 'admin') {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            'Chỉ admin mới được đăng nhập'
        )
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash || ''
    )
    if (!isPasswordValid)
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password không đúng')

    const accessToken = createAccessToken({
        id: user.id,
        username: user.username,
        role: user.role,
    })
    delete user.password_hash
    return { user, accessToken }
}

const createUserService = async payload => {
    const existedUsername = await UsersModel.getUserByUsername(payload.username)
    if (existedUsername) {
        throw new ApiError(StatusCodes.CONFLICT, 'Username đã tồn tại')
    }

    if (payload.email) {
        const existedEmail = await UsersModel.getUserByEmail(payload.email)
        if (existedEmail) {
            throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại')
        }
    }

    const user = await UsersModel.createUser(payload)
    return user
}

const listUsersService = async (limit = 50, offset = 0) => {
    return await UsersModel.listUsers(limit, offset)
}

const getUserByIdService = async id => {
    const user = await UsersModel.getUserById(id)
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
    }
    return user
}

const getUserByUidService = async uid => {
    const user = await UsersModel.getUserByUid(uid)
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
    }
    return user
}

const findUserByEmailOrUsernameService = async identifier => {
    let user = await UsersModel.getUserByEmail(identifier)
    if (!user) {
        user = await UsersModel.getUserByUsername(identifier)
    }
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User không tồn tại')
    }
    return user
}

const updateUserService = async (id, payload) => {
    const existed = await UsersModel.getUserById(id)
    if (!existed) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User không tồn tại')
    }

    const updatedUser = await UsersModel.updateUser(id, payload)
    return updatedUser
}

const deleteUserService = async id => {
    const existed = await UsersModel.getUserById(id)
    if (!existed) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User không tồn tại')
    }

    return await UsersModel.deleteUser(id)
}

export const userService = {
    registerService,
    loginService,
    createUserService,
    listUsersService,
    getUserByIdService,
    getUserByUidService,
    findUserByEmailOrUsernameService,
    updateUserService,
    deleteUserService,
}
