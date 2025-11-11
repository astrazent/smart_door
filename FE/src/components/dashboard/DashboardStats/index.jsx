import React from 'react'
import StatCard from '../StatCard'
import { useListCardUsers } from '~/hooks/useCard'
import { useListDoorUserHistory } from '~/hooks/useHistory'
import { useListDoors } from '~/hooks/useDoor'

const DashboardStats = () => {
    const { data: cardData } = useListCardUsers()
    const { data: historyData } = useListDoorUserHistory()
    const { data: doorData } = useListDoors()

    const totalCards = cardData?.data?.length || 0

    const uniqueUserIds = new Set(
        cardData?.data
            ?.filter(card => card.user_id !== null)
            .map(card => card.user_id)
    )
    const totalUsers = uniqueUserIds.size

    const totalDoorEvents = historyData?.data?.length || 0

    const totalDoors = doorData?.data?.length || 0

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Tổng số User" value={totalUsers} icon="users" />
            <StatCard title="Tổng số Thẻ" value={totalCards} icon="cards" />
            <StatCard
                title="Tổng số Lần mở/đóng"
                value={totalDoorEvents}
                icon="door-events"
            />
            <StatCard title="Tổng số Cửa" value={totalDoors} icon="doors" />
        </div>
    )
}

export default DashboardStats
