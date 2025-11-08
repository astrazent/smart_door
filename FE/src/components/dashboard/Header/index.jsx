import React from 'react'
import {
    HiMenu,
    HiOutlineSearch,
    HiOutlineBell,
    HiOutlineArrowsExpand, // Giữ lại icon này
    HiOutlineSun,
    HiOutlineMoon,
    HiChevronDown,
} from 'react-icons/hi'
import { useTheme } from '~/contexts/ThemeContext'
import logo from '~/assets/smart-door.png'
import screenfull from 'screenfull' // Import screenfull

const Logo = () => (
    <div className="flex items-center gap-2">
        <img
            src={logo}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
            SMART DOOR
        </span>
    </div>
)

const Header = () => {
    const { theme, toggleTheme } = useTheme()

    // Hàm xử lý sự kiện click để bật/tắt toàn màn hình
    const handleFullScreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle()
        }
    }

    return (
        <header className="bg-white dark:bg-gray-800 h-16 w-full px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-full">
                {/* Phần bên trái không đổi */}
                <div className="flex items-center gap-4">
                    <div className="lg:hidden">
                        <Logo />
                    </div>

                    <div className="p-2 rounded-md lg:hidden">
                        <HiMenu
                            size={24}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </div>
                </div>

                {/* Thanh tìm kiếm không đổi */}
                <div className="hidden md:block relative">
                    <HiOutlineSearch
                        size={20}
                        className="text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <input
                        type="text"
                        placeholder="Search... (Ctrl+K)"
                        className="text-sm focus:outline-none w-72 h-10 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                    />
                </div>

                {/* Phần bên phải với các icon */}
                <div className="flex items-center gap-4">
                    {/* Nút bật/tắt dark mode */}
                    <div
                        className="p-2 rounded-md cursor-pointer"
                        onClick={toggleTheme}
                    >
                        {theme === 'light' ? (
                            <HiOutlineSun
                                size={22}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        ) : (
                            <HiOutlineMoon
                                size={22}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        )}
                    </div>

                    {/* Nút phóng to toàn màn hình */}
                    <div
                        className="p-2 rounded-md cursor-pointer"
                        onClick={handleFullScreen}
                    >
                        <HiOutlineArrowsExpand
                            size={22}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </div>

                    {/* Chuông thông báo */}
                    <div className="p-2 rounded-md relative">
                        <div className="absolute top-1.5 right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            3
                        </div>
                        <HiOutlineBell
                            size={22}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </div>

                    {/* Thông tin người dùng */}
                    <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                            AN
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Anh Nam
                        </span>
                        <HiChevronDown className="text-gray-500 dark:text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
