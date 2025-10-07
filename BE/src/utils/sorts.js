/**
 * Chức năng: Chứa các hàm tiện ích, helper và thành phần dùng chung trong toàn dự án
 * Cấu trúc bên trong:
 *   - algorithm/: Thuật toán hỗ trợ (phân trang, tìm kiếm, xử lý dữ liệu...)
 *   - constants/: Các hằng số dùng chung (role, status, config...)
 *   - sorts/: Thuật toán sắp xếp (quickSort, mergeSort, bubbleSort...)
 * Tạo file mới: Khi có nhóm hàm/thuật toán/hằng số cần tách riêng để tái sử dụng và dễ quản lý
 */
/**
 * ---
 * Order an array of objects based on another array & return new Ordered Array
 * The original array will not be modified.
 * ---
 * @param {*} originalArray
 * @param {*} orderArray
 * @param {*} key = Key to order
 * @return new Ordered Array
 * Xác định các phần tử trong array gốc ban đầu (originalArray) xem nó nằm ở đâu trong array thứ 2 (orderArray) (là array mà mình dùng để sắp xếp) bằng cách tìm index (indexOf) rồi sẽ sắp xếp theo index đó bằng hàm sort của Javascript.
 */

export const mapOrder = (originalArray, orderArray, key) => {
    if (!originalArray || !orderArray || !key) return []

    const clonedArray = [...originalArray]
    const orderedArray = clonedArray.sort((a, b) => {
        return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
    })

    return orderedArray
}
