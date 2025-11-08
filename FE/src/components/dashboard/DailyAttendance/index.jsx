import React, { useMemo } from 'react'
import { useListUsers } from '~/hooks/useUser'
import { useListDoorUserHistory } from '~/hooks/useHistory'
import {
    FaUserCheck,
    FaUserClock,
    FaSpinner,
    FaExclamationTriangle,
} from 'react-icons/fa'
import { format } from 'date-fns'

const DailyAttendance = () => {
    const {
        data: usersResponse,
        isLoading: isLoadingUsers,
        isError: isErrorUsers,
        error: errorUsers,
    } = useListUsers()

    const getTodayRange = () => {
        const start = new Date()
        start.setHours(0, 0, 0, 0)
        const end = new Date()
        end.setHours(23, 59, 59, 999)
        return { start_time: start.toISOString(), end_time: end.toISOString() }
    }

    const {
        data: historyResponse,
        isLoading: isLoadingHistory,
        isError: isErrorHistory,
        error: errorHistory,
    } = useListDoorUserHistory(getTodayRange())

    const attendedUserIds = useMemo(() => {
        if (!historyResponse?.data) return new Set()
        const openActions = historyResponse.data.filter(
            record => record.action === 'OPEN' && record.user_id
        )
        return new Set(openActions.map(record => record.user_id))
    }, [historyResponse])

    if (isLoadingUsers || isLoadingHistory) {
        return (
            <div className="bg-white dark:bg-[#1E2A3A] p-6 rounded-lg flex flex-col items-center justify-center h-80">
                <FaSpinner className="animate-spin text-gray-500" size={32} />
                <span className="mt-3 text-gray-600 dark:text-gray-300">
                    Đang tải dữ liệu chấm công...
                </span>
            </div>
        )
    }

    if (isErrorUsers || isErrorHistory) {
        return (
            <div className="bg-white dark:bg-[#1E2A3A] p-6 rounded-lg flex flex-col items-center justify-center shadow-sm h-80 text-center">
                <FaExclamationTriangle className="text-red-500" size={32} />
                <h3 className="mt-3 text-lg font-semibold text-red-600 dark:text-red-400">
                    Đã xảy ra lỗi!
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                    Không thể tải danh sách người dùng hoặc lịch sử.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {errorUsers?.message || errorHistory?.message}
                </p>
            </div>
        )
    }

    const users = usersResponse?.data || []
    const today = format(new Date(), 'dd/MM/yyyy')

    return (
        <div className="bg-white dark:bg-[#1E2A3A] p-4 rounded-lg shadow-sm h-[500px] flex flex-col">
            <div className="px-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Bảng Chấm Công
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hôm nay, ngày {today}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto pt-2">
                <div className="space-y-1">
                    {users.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                            Không tìm thấy người dùng nào trong hệ thống.
                        </p>
                    ) : (
                        users.map(user => {
                            const hasAttended = attendedUserIds.has(user.id)

                            return (
                                <div
                                    key={user.id}
                                    className={`flex items-center justify-between p-3 rounded-lg transition-colors
                                        hover:bg-gray-100 dark:hover:bg-[#223048]`}
                                >
                                    {/* Thông tin User */}
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                                ${hasAttended ? 'bg-green-500' : 'bg-yellow-500'}`}
                                        >
                                            {user.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                {user.full_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                @{user.username} - {user.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Trạng thái chấm công */}
                                    <div>
                                        {hasAttended ? (
                                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                                <FaUserCheck />
                                                <span className="text-sm font-medium">
                                                    Đã chấm công
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                                                <FaUserClock />
                                                <span className="text-sm font-medium">
                                                    Chưa chấm công
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default DailyAttendance
