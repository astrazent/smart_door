import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FiActivity, FiLoader } from 'react-icons/fi'
import { openDoor, closeDoor } from '~/services/espService'
import { updateSelectedDoor } from '~/redux/reducers/doorReducer'

const OpenDoorCard = () => {
    const dispatch = useDispatch()
    const selectedDoor = useSelector(state => state.door.selectedDoor)
    const [isLoading, setIsLoading] = useState(false)

    if (!selectedDoor) return null

    const doorState =
        selectedDoor.current_status === 'OPENED' ? 'open' : 'closed'

    const handleDoorAction = async () => {
        if (isLoading) return
        setIsLoading(true)

        const originalStatus = selectedDoor.current_status

        const optimisticStatus =
            originalStatus === 'OPENED' ? 'CLOSED' : 'OPENED'

        dispatch(
            updateSelectedDoor({
                current_status: optimisticStatus,
                last_updated: new Date().toISOString(),
            })
        )

        const action = optimisticStatus === 'OPENED' ? openDoor : closeDoor

        try {
            const res = await Promise.race([
                action({ door_code: selectedDoor.door_code }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('timeout')), 1000)
                ),
            ])

            if (res.data?.status !== 'success') {
                throw new Error('API failed')
            }
        } catch (error) {
            console.error('API door error:', error)
            dispatch(
                updateSelectedDoor({
                    current_status: originalStatus,
                    last_updated: new Date().toISOString(),
                })
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            onClick={handleDoorAction}
            className={`relative overflow-hidden p-8 rounded-2xl shadow-lg flex items-center justify-between transition-all duration-300 hover:scale-[1.03] cursor-pointer h-36
            ${
                doorState === 'open'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                    : 'bg-gradient-to-br from-gray-700 to-gray-900'
            }`}
        >
            <div
                className={`absolute inset-0 blur-3xl opacity-20 transition-all duration-500 ${
                    doorState === 'open' ? 'bg-blue-400' : 'bg-gray-500'
                }`}
            ></div>

            <div className="relative z-10 p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-inner">
                {isLoading ? (
                    <FiLoader className="text-white animate-spin" size={28} />
                ) : (
                    <FiActivity className="text-white" size={28} />
                )}
            </div>

            <div className="relative z-10 text-right">
                <p className="text-white/70 text-sm tracking-wide">
                    {doorState === 'open' ? 'Cửa đang mở' : 'Cửa đã đóng'}
                </p>
                <h4 className="text-3xl font-semibold text-white mt-1 drop-shadow-sm">
                    {doorState === 'open' ? 'Nhấn để đóng' : 'Nhấn để mở'}
                </h4>
            </div>
        </div>
    )
}

export default OpenDoorCard
