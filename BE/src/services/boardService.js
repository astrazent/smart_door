/**
 * Chức năng: Chứa các business logic (nghiệp vụ chính), tách riêng khỏi controller
 * Tạo file mới:
 *   - Khi có entity cần xử lý logic phức tạp (UserService.js, ProductService.js, OrderService.js)
 *   - Khi có chức năng chung cần tái sử dụng nhiều nơi (AuthService.js, ReportService.js)
 */

import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { BoardsModel } from '~/models/boardModel'
const createBoard = async reqBody => {
    
    const boardData = {
        ...reqBody,
        slug: slugify(reqBody.title),
    }
    
    const newBoard = await BoardsModel.createBoard(boardData)
    console.log(newBoard)
    
    
    return newBoard
}
export const boardService = {
    createBoard,
}
