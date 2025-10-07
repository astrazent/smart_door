import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '~/components/Navbar'

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout
