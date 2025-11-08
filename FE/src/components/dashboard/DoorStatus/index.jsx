import React from 'react'
// Để sử dụng icon, bạn cần cài đặt thư viện react-icons
// Bằng câu lệnh: npm install react-icons
import { FaDoorOpen, FaDoorClosed } from 'react-icons/fa'

// Component sẽ nhận một prop là `isActive` (true hoặc false) để quyết định trạng thái
const DoorStatus = ({ isActive }) => {
    return (
        <div
            className={`
                p-6 rounded-lg shadow-md h-full text-white 
                flex flex-col justify-center items-center 
                transition-colors duration-500 ease-in-out
                ${isActive ? 'bg-green-600' : 'bg-slate-700'}
            `}
        >
            {/* Icon chính */}
            <div className="text-7xl mb-4">
                {isActive ? <FaDoorOpen /> : <FaDoorClosed />}
            </div>

            {/* Trạng thái chữ */}
            <h2 className="text-3xl font-bold mb-1">
                {isActive ? 'Hoạt Động' : 'Không Hoạt Động'}
            </h2>
            <p className={isActive ? 'text-green-200' : 'text-slate-300'}>
                Trạng thái cửa
            </p>

            {/* Chấm trạng thái */}
            <div className="flex items-center mt-4">
                <span
                    className={`
                        relative flex h-3 w-3 rounded-full
                        ${isActive ? 'bg-green-400' : 'bg-slate-400'}
                    `}
                >
                    {isActive && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                    )}
                </span>
                <span className="ml-2 text-sm">
                    {isActive ? 'Cửa đang mở' : 'Cửa đã đóng'}
                </span>
            </div>
        </div>
    )
}

export default DoorStatus
