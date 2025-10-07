/**
 * Chức năng: Chứa logic kiểm tra, xác thực dữ liệu đầu vào (request body, params, query...)
 * Tạo file mới:
 *   - Khi có entity/module riêng cần validation (userValidation.js, productValidation.js, orderValidation.js)
 *   - Khi muốn gom các rule validation cho từng chức năng để dễ bảo trì
 */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createBoard = async (req, res, next) => {
    /**
     * Note: Mặc định chúng ta không cần phải custom message ở phía BE làm gì vì để cho Front-end tự
     * validate và custom message phía FE cho đẹp. (keyword: custom message)
     * Back-end chỉ cần validate Đảm Bảo Dữ Liệu Chuẩn Xác, và trả về message mặc định từ thư viện là được.
     * Quan trọng: Việc Validate dữ liệu BẮT BUỘC phải có ở phía Back-end vì đây là điểm cuối để lưu trữ dữ
     * liệu vào Database.
     * Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả Back-end
     * và Front-end nhé.
     */
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict(),
    })

    try {
        console.log('req.body: ', req.body)
        
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        
        next()
    } catch (error) {
        next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                new Error(error).message
            )
        )
    }
}

export const boardValidation = {
    createBoard,
}
