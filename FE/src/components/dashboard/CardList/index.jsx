import React from 'react'

import { useListCardUsers } from '~/hooks/useCard'
import { FaIdCard, FaSpinner, FaUserCircle } from 'react-icons/fa'

const CardList = () => {
    const { data: response, isLoading, isError, error } = useListCardUsers()

    const cards = response?.data || []

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-gray-400" size={32} />
                <span className="ml-3 text-gray-600">
                    Đang tải danh sách thẻ...
                </span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center h-64">
                <h3 className="text-lg font-semibold text-red-600">Lỗi!</h3>
                <p className="text-gray-700">Không thể tải dữ liệu thẻ.</p>
                <p className="text-sm text-gray-500 mt-2">{error.message}</p>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-[#1E2A3A] transition-colors duration-300 p-4 rounded-lg shadow-md max-h-96 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 px-2 transition-colors duration-300">
                Quản Lý Thẻ Trong Hệ Thống
            </h3>

            <div className="flex-1 overflow-y-auto">
                <div className="space-y-3 p-2">
                    {cards.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-300 py-4 transition-colors duration-300">
                            Không có thẻ nào trong hệ thống.
                        </p>
                    ) : (
                        cards.map(card => (
                            <div
                                key={card.card_id}
                                className="flex items-center justify-between p-2 rounded-md 
                        hover:bg-gray-50 dark:hover:bg-[#223048] 
                        transition-colors duration-300"
                            >
                                <div className="flex items-center space-x-4">
                                    {card.user_id ? (
                                        <FaUserCircle
                                            className="text-indigo-500 dark:text-indigo-400 transition-colors duration-300"
                                            size={32}
                                        />
                                    ) : (
                                        <FaIdCard
                                            className="text-gray-400 dark:text-gray-300 transition-colors duration-300"
                                            size={32}
                                        />
                                    )}

                                    <div>
                                        {card.user_name ? (
                                            <span className="font-semibold text-gray-900 dark:text-gray-100 block transition-colors duration-300">
                                                {card.user_name}
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-orange-600 dark:text-orange-300 block italic transition-colors duration-300">
                                                Thẻ chưa được gán
                                            </span>
                                        )}

                                        {card.username && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                                @{card.username}
                                            </span>
                                        )}

                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono block transition-colors duration-300">
                                            UID: {card.card_uid}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    {card.is_active === 1 ? (
                                        <span
                                            className="px-3 py-1 text-xs font-medium 
                                        text-green-800 dark:text-green-300 
                                        bg-green-100 dark:bg-green-800/30 rounded-full
                                        transition-colors duration-300"
                                        >
                                            Hoạt động
                                        </span>
                                    ) : (
                                        <span
                                            className="px-3 py-1 text-xs font-medium 
                                        text-gray-800 dark:text-gray-300 
                                        bg-gray-200 dark:bg-gray-700/30 rounded-full
                                        transition-colors duration-300"
                                        >
                                            Vô hiệu hóa
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default CardList
