import React from 'react'
import { useListDoorUserHistory } from '~/hooks/useHistory'
import ActionStatusPill from '../StatusPill'

const DoorHistoryTable = () => {
    const { data, isLoading, isError, error } = useListDoorUserHistory({})
    const historyData = data?.data || []

    if (isLoading)
        return (
            <p className="text-center py-4 text-gray-500">
                Đang tải lịch sử...
            </p>
        )
    if (isError)
        return (
            <p className="text-center py-4 text-red-500">
                Lỗi: {error.message}
            </p>
        )

    return (
        <div className="bg-white dark:bg-[#1E2A3A] p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Lịch sử truy cập gần đây
            </h3>
            <div className="overflow-auto h-[432px]">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-[#1E2A3A] sticky top-0 z-10">
                        <tr>
                            {[
                                'Thời gian',
                                'Người dùng',
                                'Tên cửa',
                                'Vị trí',
                                'Hành động',
                                'Ghi chú',
                            ].map(h => (
                                <th
                                    key={h}
                                    className="p-2 text-left text-gray-500 uppercase"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.map(item => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="p-2">
                                    {new Date(item.time).toLocaleString(
                                        'vi-VN'
                                    )}
                                </td>
                                <td className="p-2 font-medium">
                                    {item.user_name || 'Hệ thống'}
                                </td>
                                <td className="p-2">{item.door_name}</td>
                                <td className="p-2">{item.location}</td>
                                <td className="p-2 text-center">
                                    <ActionStatusPill
                                        action={item.door_status}
                                    />
                                </td>
                                <td className="p-2 text-gray-500 dark:text-green-300">
                                    {item.note}
                                </td>
                            </tr>
                        ))}
                        {historyData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-4 text-gray-500"
                                >
                                    Không có dữ liệu lịch sử.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DoorHistoryTable
