/**
 * Folder routes/v1:
 * Chức năng:
 *  - Chứa endpoint API phiên bản 2 (nâng cấp/tối ưu/thay đổi logic so với v1)
 *  - Giúp phát triển API mới mà không ảnh hưởng đến client đang dùng v1
 * Tạo file mới:
 *  -  Khi có module API mới (User, Product, Order...) để gom route liên quan
 *  -  Khi nâng cấp hoặc thay đổi logic, cần tạo version mới (v2, v3...) thay vì sửa trực tiếp v1
 */
import express from 'express'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()

//Check APIs v2 status
Router.get('/ping', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V2 are ready to use.' })
})

/**
 * Tổng hợp tất cả routes v2
 */

export const APIs_V2 = Router
