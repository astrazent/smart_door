import React from 'react'
import {
    FiUsers,
    FiCreditCard,
    FiActivity,
    FiHome,
    FiArchive,
} from 'react-icons/fi'

const StatCard = ({ title, value, icon }) => {
    const renderIcon = () => {
        switch (icon) {
            // --- Tổng số User ---
            case 'users':
                return (
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <FiUsers
                            className="text-blue-500 dark:text-blue-400"
                            size={24}
                        />
                    </div>
                )

            // --- Tổng số Thẻ ---
            case 'cards':
                return (
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <FiCreditCard
                            className="text-green-500 dark:text-green-400"
                            size={24}
                        />
                    </div>
                )

            // --- Tổng số Lần mở/đóng ---
            case 'door-events':
                return (
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                        <FiActivity
                            className="text-indigo-500 dark:text-indigo-400"
                            size={24}
                        />
                    </div>
                )

            // --- Tổng số Cửa ---
            case 'doors':
                return (
                    <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                        <FiHome
                            className="text-teal-500 dark:text-teal-400"
                            size={24}
                        />
                    </div>
                )

            default:
                return (
                    <div className="p-3 bg-gray-100 dark:bg-gray-700/40 rounded-lg">
                        <FiArchive
                            className="text-gray-500 dark:text-gray-300"
                            size={24}
                        />
                    </div>
                )
        }
    }

    return (
        <div
            className="bg-white dark:bg-[#1E2A3A] p-6 rounded-lg shadow 
                        dark:border dark:border-[#2E3A4A] 
                        flex items-center hover:scale-[1.02] 
                        dark:hover:bg-[#223048] transition-transform cursor-pointer"
        >
            {renderIcon()}
            <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400">{title}</p>
                <h4 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {value}
                </h4>
            </div>
        </div>
    )
}

export default StatCard
