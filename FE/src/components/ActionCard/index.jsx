import React from 'react'
import { FiActivity, FiCreditCard, FiShield } from 'react-icons/fi'

const StatCard = ({ title, value, icon }) => {
    const getStyle = () => {
        switch (icon) {
            case 'door-events':
                return {
                    bg: 'bg-indigo-500 dark:bg-indigo-600',
                    iconBg: 'bg-white/20',
                    iconColor: 'text-white',
                }
            case 'cards':
                return {
                    bg: 'bg-green-500 dark:bg-green-600',
                    iconBg: 'bg-white/20',
                    iconColor: 'text-white',
                }
            case 'security':
                return {
                    bg: 'bg-red-500 dark:bg-red-600',
                    iconBg: 'bg-white/20',
                    iconColor: 'text-white',
                }
            default:
                return {
                    bg: 'bg-gray-500 dark:bg-gray-600',
                    iconBg: 'bg-white/20',
                    iconColor: 'text-white',
                }
        }
    }

    const { bg, iconBg, iconColor } = getStyle()

    const renderIcon = () => {
        switch (icon) {
            case 'door-events':
                return (
                    <div className={`p-3 ${iconBg} rounded-lg`}>
                        <FiActivity className={`${iconColor}`} size={28} />
                    </div>
                )
            case 'cards':
                return (
                    <div className={`p-3 ${iconBg} rounded-lg`}>
                        <FiCreditCard className={`${iconColor}`} size={28} />
                    </div>
                )
            case 'security':
                return (
                    <div className={`p-3 ${iconBg} rounded-lg`}>
                        <FiShield className={`${iconColor}`} size={28} />
                    </div>
                )
            default:
                return (
                    <div className={`p-3 ${iconBg} rounded-lg`}>
                        <FiActivity className={`${iconColor}`} size={28} />
                    </div>
                )
        }
    }

    return (
        <div
            className={`${bg} p-8 rounded-2xl shadow-lg flex items-center justify-between transform transition-transform hover:scale-[1.03] cursor-pointer h-36`}
        >
            {renderIcon()}
            <div className="text-right">
                <p className="text-white/80 text-sm">{title}</p>
                {value && (
                    <h4 className="text-3xl font-semibold text-white mt-1">
                        {value}
                    </h4>
                )}
            </div>
        </div>
    )
}

export default StatCard
