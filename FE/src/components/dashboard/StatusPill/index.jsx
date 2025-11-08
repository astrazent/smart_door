import React from 'react'

const ActionStatusPill = ({ action }) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium text-white rounded-full'

    const statusStyles = {
        OPEN: {
            label: 'Mở cửa',
            classes: `${baseClasses} bg-green-500`,
        },
        CLOSED: {
            label: 'Đóng cửa',
            classes: `${baseClasses} bg-blue-500`,
        },
        FAILED: {
            label: 'Thất bại',
            classes: `${baseClasses} bg-red-500`,
        },
    }

    // Mặc định cho các trạng thái không xác định
    const defaultStatus = {
        label: action,
        classes: `${baseClasses} bg-gray-400`,
    }

    const style = statusStyles[action] || defaultStatus

    return <span className={style.classes}>{style.label}</span>
}

export default ActionStatusPill
