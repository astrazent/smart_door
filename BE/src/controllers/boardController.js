/**
 * Chức năng: xử lý logic cho request, gọi model thao tác dữ liệu, trả response về client
 * Tạo file mới:
 *   - Khi có entity riêng (User, Product, Order...) cần CRUD/logic xử lý riêng (userController.js, productController.js, orderController.js)
 *   - Khi có chức năng độc lập (Auth, Report, Dashboard...) không gắn trực tiếp với entity nào (authController.js)
 */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createBoard = async (req, res, next) => {
    try {
        
        const createBoard = await boardService.createBoard(req.body)
        console.log('check')
        
        res.status(StatusCodes.CREATED).json(createBoard)
    } catch (error) {
        next(error)
    }
}

export const boardController = {
    createBoard,
}
