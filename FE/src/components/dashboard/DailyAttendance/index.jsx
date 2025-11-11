import React, { useMemo } from 'react'
import { useListUsers } from '~/hooks/useUser'
import { useListAttendance } from '~/hooks/useAttendance'
import {
    FaSpinner,
    FaExclamationTriangle,
    FaSignInAlt,
    FaSignOutAlt,
} from 'react-icons/fa'
import { format, parseISO } from 'date-fns'

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
        data: attendanceResponse,
        isLoading: isLoadingAttendance,
        isError: isErrorAttendance,
        error: errorAttendance,
    } = useListAttendance(getTodayRange())

    const attendanceData = useMemo(() => {
        if (!usersResponse?.data || !attendanceResponse?.data) return []

        const users = usersResponse.data
        const attendanceRecords = attendanceResponse.data

        const dailyAttendance = new Map()

        for (const record of attendanceRecords) {
            const userId = record.user_id
            const checkInTime = parseISO(record.check_in_time)
            const checkOutTime = record.check_out_time
                ? parseISO(record.check_out_time)
                : null

            const existingRecord = dailyAttendance.get(userId)

            if (!existingRecord) {
                dailyAttendance.set(userId, {
                    user_id: userId,
                    user_name: record.user_name,
                    door_name: record.door_name,
                    check_in_time: checkInTime,
                    check_out_time: checkOutTime,
                })
            } else {
                if (checkInTime < existingRecord.check_in_time) {
                    existingRecord.check_in_time = checkInTime
                    existingRecord.door_name = record.door_name
                }

                if (
                    checkOutTime &&
                    (!existingRecord.check_out_time ||
                        checkOutTime < existingRecord.check_out_time)
                ) {
                    existingRecord.check_out_time = checkOutTime
                }
            }
        }

        return users.map(user => {
            const attendance = dailyAttendance.get(user.id)
            return {
                ...user,
                door_name: attendance?.door_name || 'N/A',
                check_in_time: attendance?.check_in_time,
                check_out_time: attendance?.check_out_time,
                hasAttended: !!attendance,
            }
        })
    }, [usersResponse, attendanceResponse])

    if (isLoadingUsers || isLoadingAttendance) {
        return (
            <div className="bg-white dark:bg-[#1E2A3A] p-6 rounded-lg flex flex-col items-center justify-center h-80">
                <FaSpinner className="animate-spin text-gray-500" size={32} />
                <span className="mt-3 text-gray-600 dark:text-gray-300">
                    Đang tải dữ liệu chấm công...
                </span>
            </div>
        )
    }

    if (isErrorUsers || isErrorAttendance) {
        return (
            <div className="bg-white dark:bg-[#1E2A3A] p-6 rounded-lg flex flex-col items-center justify-center shadow-sm h-80 text-center">
                <FaExclamationTriangle className="text-red-500" size={32} />
                <h3 className="mt-3 text-lg font-semibold text-red-600 dark:text-red-400">
                    Đã xảy ra lỗi!
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                    Không thể tải dữ liệu.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {errorUsers?.message || errorAttendance?.message}
                </p>
            </div>
        )
    }

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
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Tên người dùng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Check-in
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Check-out
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                                >
                                    Không tìm thấy người dùng nào trong hệ
                                    thống.
                                </td>
                            </tr>
                        ) : (
                            attendanceData.map(user => (
                                <tr
                                    key={user.id}
                                    className="bg-white border-b dark:bg-[#1E2A3A] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#223048]"
                                >
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                                ${user.hasAttended ? 'bg-green-500' : 'bg-yellow-500'}`}
                                            >
                                                {user.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p>{user.full_name}</p>
                                                <p className="text-xs text-gray-500">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">
                                        {user.check_in_time ? (
                                            <div className="flex items-center space-x-2 text-green-600">
                                                <FaSignInAlt />
                                                <span>
                                                    {format(
                                                        user.check_in_time,
                                                        'HH:mm:ss'
                                                    )}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-yellow-600">
                                                Chưa có
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.check_out_time ? (
                                            <div className="flex items-center space-x-2 text-red-600">
                                                <FaSignOutAlt />
                                                <span>
                                                    {format(
                                                        user.check_out_time,
                                                        'HH:mm:ss'
                                                    )}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-yellow-600">
                                                Chưa có
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DailyAttendance
