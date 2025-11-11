import React from 'react'
import { useSelector } from 'react-redux'
import DoorStatus from '~/components/dashboard/DoorStatus'
import Overview from '~/components/dashboard/Overview'
import CardList from '~/components/dashboard/CardList'
import DoorHistoryTable from '~/components/dashboard/DoorHistoryTable'
import DailyAttendance from '~/components/dashboard/DailyAttendance'
import DashboardStats from '~/components/dashboard/DashboardStats'
import ActionCards from '~/components/ActionCard'

function Dashboard() {
    const selectedDoor = useSelector(state => state.door?.selectedDoor)

    const doorCode = selectedDoor?.door_code || ''

    return (
        <div className="bg-gray-100 dark:bg-[#0F172A] transition-colors duration-300 min-h-screen flex flex-col gap-6">
            {}
            <ActionCards />

            {}
            <div className="flex flex-col lg:flex-row gap-6">
                {}
                <div className="flex-[1] lg:order-1">
                    <DoorStatus params={{ door_code: doorCode }} />
                </div>

                {}
                <div className="flex-[3] flex flex-col lg:flex-row gap-6 lg:order-2">
                    {}
                    <div className="flex-[1.5]">
                        <Overview />
                    </div>
                    {}
                    <div className="flex-1">
                        <CardList />
                    </div>
                </div>
            </div>
            {}

            {}
            <DashboardStats />

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {}
                <div>
                    <DailyAttendance />
                </div>
                {}
                <div>
                    <DoorHistoryTable />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
