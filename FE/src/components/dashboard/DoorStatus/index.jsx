import React, { useEffect, useRef, useState } from 'react'
import { FaDoorOpen, FaDoorClosed } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { useDoorStatus } from '~/hooks/useEsp'
import { updateSelectedDoor } from '~/redux/reducers/doorReducer'

const DoorStatus = ({ params }) => {
    const dispatch = useDispatch()
    const { data, isError } = useDoorStatus(params)
    const doorStatus = data?.data?.current_status

    const [isOffline, setIsOffline] = useState(false)
    const errorCount = useRef(0)

    useEffect(() => {
        if (isError) {
            errorCount.current += 1
        } else {
            errorCount.current = 0
        }

        setIsOffline(errorCount.current >= 3)
    }, [isError])

    const isActive =
        !isOffline && (doorStatus === 'OPENED' || doorStatus === 'CLOSED')
    const isDoorOpen = isActive && doorStatus === 'OPENED'

    useEffect(() => {
        if (doorStatus && !isOffline) {
            dispatch(updateSelectedDoor({ current_status: doorStatus }))
        }
    }, [doorStatus, dispatch, isOffline])

    return (
        <div
            className={`p-6 rounded-lg shadow-md h-full text-white 
                flex flex-col justify-center items-center 
                transition-colors duration-500 ease-in-out
                ${isOffline ? 'bg-slate-700' : 'bg-green-600'}`}
        >
            <div className="text-7xl mb-4">
                {isDoorOpen ? <FaDoorOpen /> : <FaDoorClosed />}
            </div>

            <h2 className="text-3xl font-bold mb-1">
                {isOffline ? 'Không Hoạt Động' : 'Hoạt Động'}
            </h2>
            <p className={isOffline ? 'text-slate-300' : 'text-green-200'}>
                Trạng thái cửa
            </p>

            <div className="flex items-center mt-4">
                <span
                    className={`relative flex h-3 w-3 rounded-full ${
                        isOffline
                            ? 'bg-slate-400'
                            : isDoorOpen
                              ? 'bg-red-400'
                              : 'bg-green-400'
                    }`}
                >
                    {isDoorOpen && !isOffline && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                    )}
                </span>
                <span className="ml-2 text-sm">
                    {isOffline
                        ? 'Thiết bị không phản hồi'
                        : isDoorOpen
                          ? 'Cửa đang mở'
                          : 'Cửa đã đóng'}
                </span>
            </div>
        </div>
    )
}

export default DoorStatus
