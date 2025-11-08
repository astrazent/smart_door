import React, { useState, useEffect } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { useListDoorUserHistory } from '~/hooks/useHistory'
import { format, getWeek, getYear, getMonth, startOfYear } from 'date-fns'

// Hàm xử lý và tổng hợp dữ liệu
const processHistoryData = (history, timeRange) => {
    if (!history || !history.data) return []

    // Chỉ lọc những lần mở cửa thành công
    const openEvents = history.data.filter(event => event.action === 'OPEN')
    const currentYear = new Date().getFullYear()

    if (timeRange === 'month') {
        // ... (giữ nguyên logic cho 'month')
    }

    if (timeRange === 'week') {
        // ... (giữ nguyên logic cho 'week')
    }

    // CẬP NHẬT LOGIC CHO 'day'
    if (timeRange === 'day') {
        // Gom nhóm các sự kiện theo ngày và đếm số lần mở cửa
        const dailyCounts = openEvents.reduce((acc, event) => {
            const eventDate = new Date(event.time)
            // Lấy 30 ngày gần nhất
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

            // Chỉ xử lý các sự kiện trong vòng 30 ngày qua
            if (eventDate >= thirtyDaysAgo) {
                const dateKey = format(eventDate, 'dd/MM') // Định dạng key là 'ngày/tháng'
                acc[dateKey] = (acc[dateKey] || 0) + 1
            }
            return acc
        }, {})

        // Chuyển đổi object đã gom nhóm thành mảng cho biểu đồ và sắp xếp
        return Object.keys(dailyCounts)
            .map(dateKey => {
                // Tách ngày và tháng để tạo lại đối tượng Date và sắp xếp cho đúng
                const [day, month] = dateKey.split('/')
                return {
                    name: dateKey,
                    value: dailyCounts[dateKey],
                    // Thêm một trường date để sắp xếp
                    date: new Date(currentYear, month - 1, day),
                }
            })
            .sort((a, b) => a.date - b.date) // Sắp xếp các ngày theo thứ tự tăng dần
    }

    if (timeRange === 'year') {
        // ... (giữ nguyên logic cho 'year')
    }

    return []
}

const Overview = () => {
    // State để quản lý bộ lọc thời gian (tuần, tháng, năm) và menu
    const [timeRange, setTimeRange] = useState('day') // 'week', 'month', 'year'
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [chartData, setChartData] = useState([])

    // Gọi hook để lấy dữ liệu, giả sử không cần params
    const { data: historyData, isLoading } = useListDoorUserHistory()

    // Sử dụng useEffect để xử lý dữ liệu mỗi khi historyData hoặc timeRange thay đổi
    useEffect(() => {
        const processedData = processHistoryData(historyData, timeRange)
        setChartData(processedData)
    }, [historyData, timeRange])

    const handleSetTimeRange = range => {
        setTimeRange(range)
        setIsMenuOpen(false) // Đóng menu sau khi chọn
    }

    if (isLoading) {
        return <div>Đang tải dữ liệu...</div>
    }

    return (
        <div className="bg-white dark:bg-[#1E2A3A] transition-colors duration-300 p-6 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Thống kê mở cửa
                </h3>
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
                    >
                        <HiOutlineDotsHorizontal size={24} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#2E3A4A] rounded-md shadow-lg z-10">
                            <ul className="py-1">
                                {['day', 'week', 'month', 'year'].map(range => (
                                    <li key={range}>
                                        <button
                                            onClick={() =>
                                                handleSetTimeRange(range)
                                            }
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#32415A]"
                                        >
                                            {range === 'day'
                                                ? 'Theo ngày'
                                                : range === 'week'
                                                  ? 'Theo tuần'
                                                  : range === 'month'
                                                    ? 'Theo tháng'
                                                    : 'Theo năm'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="h-66">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorValue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#4ADE80"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#4ADE80"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#374151"
                        />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1E2A3A',
                                border: 'none',
                                color: '#F3F4F6',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#22C55E"
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            strokeWidth={2}
                            name="Số lần mở"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Overview
