import React from 'react'
import ActionCard from '../ActionCard'

const ActionCards = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
                title="Mở cửa"
                value="Nhấn để mở"
                icon="door-events" // icon cho các sự kiện liên quan đến cửa
            />
            <ActionCard
                title="Lấy mã thẻ"
                value="Tạo mã mới"
                icon="cards" // icon cho thẻ
            />
            <ActionCard
                title="Chống trộm"
                value="Đã kích hoạt"
                icon="security" // icon mới cho bảo mật
            />
        </div>
    )
}

export default ActionCards
