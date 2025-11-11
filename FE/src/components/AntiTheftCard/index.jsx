import React from 'react'
import { FiShield } from 'react-icons/fi'

const AntiTheftCard = () => {
    return (
        <div className="bg-red-500 dark:bg-red-600 p-8 rounded-2xl shadow-lg flex items-center justify-between transform transition-transform hover:scale-[1.03] cursor-pointer h-36">
            <div className="p-3 bg-white/20 rounded-lg">
                <FiShield className="text-white" size={28} />
            </div>
            <div className="text-right">
                <p className="text-white/80 text-sm">Chống trộm</p>
                <h4 className="text-3xl font-semibold text-white mt-1">
                    Đã kích hoạt
                </h4>
            </div>
        </div>
    )
}

export default AntiTheftCard
