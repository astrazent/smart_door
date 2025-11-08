import { userService } from '~/services/userService.js'
import { StatusCodes } from 'http-status-codes'

const register = async (req, res, next) => {
    try {
        const data = await userService.registerService(req.body)
        return res.status(StatusCodes.CREATED).json({
            message: 'Đăng ký thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body
        const { user, accessToken } = await userService.loginService(
            identifier,
            password
        )

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        })

        return res.status(StatusCodes.OK).json({
            message: 'Đăng nhập thành công',
            user,
        })
    } catch (error) {
        next(error)
    }
}

const logout = (req, res, next) => {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        return res.status(StatusCodes.OK).json({
            message: 'Đăng xuất thành công',
        })
    } catch (error) {
        next(error)
    }
}

const createUser = async (req, res, next) => {
    try {
        const data = await userService.createUserService(req.body)
        return res.status(StatusCodes.CREATED).json({
            message: 'Tạo user thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const listUsers = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0
        const data = await userService.listUsersService(limit, offset)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách user thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await userService.getUserByIdService(id)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy thông tin user thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await userService.updateUserService(id, req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật user thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        await userService.deleteUserService(id)
        return res.status(StatusCodes.OK).json({
            message: 'Xóa user thành công',
        })
    } catch (error) {
        next(error)
    }
}

export const userController = {
    register,
    login,
    logout,
    createUser,
    listUsers,
    getUserById,
    updateUser,
    deleteUser,
}
