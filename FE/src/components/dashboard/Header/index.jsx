import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    HiOutlineArrowsExpand,
    HiOutlineSun,
    HiOutlineMoon,
    HiChevronDown,
    HiCheckCircle,
} from 'react-icons/hi'
import { FaDoorOpen } from 'react-icons/fa'
import { MdOutlineLogout } from 'react-icons/md'

import { useTheme } from '~/contexts/ThemeContext'
import { useLogout } from '~/hooks/useUser'
import { useListDoors } from '~/hooks/useDoor'

import { setSelectedDoor } from '~/redux/reducers/doorReducer'
import logo from '~/assets/smart-door.png'
import screenfull from 'screenfull'

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
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    const selectedDoor = useSelector(state => state.door.selectedDoor)
    const fullName = user?.full_name || 'User'

    const { logout } = useLogout()
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
    const [doorDropdownOpen, setDoorDropdownOpen] = useState(false)

    const { data: doorsResponse, isLoading } = useListDoors()
    const doorsList = doorsResponse?.data || []

    useEffect(() => {
        if (!selectedDoor && doorsList.length > 0) {
            const mainDoor =
                doorsList.find(
                    door => door.name.toLowerCase() === 'cửa chính'
                ) || doorsList[0]

            dispatch(setSelectedDoor(mainDoor))
        }
    }, [doorsList, selectedDoor, dispatch])

    const handleFullScreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle()
        }
    }

    const handleSelectDoor = door => {
        dispatch(setSelectedDoor(door))
        setDoorDropdownOpen(false)
    }

    return (
        <header className="bg-white dark:bg-gray-800 h-16 w-full px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-full">
                {}
                <div className="flex items-center gap-4">
                    <div className="lg:hidden">
                        <Logo />
                    </div>
                </div>

                {}
                <div className="flex items-center gap-4">
                    {}
                    <div
                        className="p-2 rounded-md cursor-pointer"
                        onClick={toggleTheme}
                    >
                        {theme === 'light' ? (
                            <HiOutlineSun size={22} />
                        ) : (
                            <HiOutlineMoon size={22} />
                        )}
                    </div>

                    {}
                    <div
                        className="p-2 rounded-md cursor-pointer"
                        onClick={handleFullScreen}
                    >
                        <HiOutlineArrowsExpand size={22} />
                    </div>

                    {}
                    <div className="relative">
                        <div
                            className="p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            onClick={() =>
                                setDoorDropdownOpen(!doorDropdownOpen)
                            }
                        >
                            <FaDoorOpen size={22} />
                        </div>
                        {doorDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-xl rounded-lg py-1 z-[9999] border border-gray-200 dark:border-gray-600">
                                {isLoading ? (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                        Đang tải...
                                    </div>
                                ) : (
                                    doorsList.map(door => (
                                        <button
                                            key={door.id}
                                            onClick={() =>
                                                handleSelectDoor(door)
                                            }
                                            className={`w-full flex justify-between items-center text-left px-4 py-2 text-sm rounded-md transition-colors
                            hover:bg-gray-100 dark:hover:bg-gray-600
                            ${selectedDoor?.id === door.id ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                                        >
                                            <span>{door.name}</span>
                                            {selectedDoor?.id === door.id && (
                                                <HiCheckCircle className="text-green-500" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {}
                    <div className="relative">
                        <div
                            className="flex items-center gap-2 p-2 rounded-md cursor-pointer"
                            onClick={() =>
                                setUserDropdownOpen(!userDropdownOpen)
                            }
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                {fullName.charAt(0)}
                            </div>
                            <span className="hidden sm:block text-sm font-medium">
                                {fullName}
                            </span>
                            <HiChevronDown />
                        </div>

                        {userDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 z-10">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    <MdOutlineLogout size={18} />
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
