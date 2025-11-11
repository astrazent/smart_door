import React from 'react'

const ActionStatusPill = ({ action }) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium text-white rounded-full'

    const statusStyles = {
        OPEN: {
            label: 'OPENED',
            classes: `${baseClasses} bg-green-500`,
        },
        CLOSED: {
            label: 'CLOSED',
            classes: `${baseClasses} bg-blue-500`,
        },
        FAILED: {
            label: 'FAILED',
            classes: `${baseClasses} bg-red-500`,
        },
    }

    const defaultStatus = {
        label: action,
        classes: `${baseClasses} bg-yellow-500`,
    }

    const style = statusStyles[action] || defaultStatus

    return <span className={style.classes}>{style.label}</span>
}

export default ActionStatusPill
