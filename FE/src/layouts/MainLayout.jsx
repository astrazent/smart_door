import React, { useState } from 'react'
import Header from '~/components/dashboard/Header'
import Footer from '~/components/dashboard/Footer'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-gray-800 dark:text-gray-200 flex flex-col">
            <Header />

            <div className="flex flex-1">
                <main className="flex-1 p-4 sm:p-6 bg-gray-100 dark:bg-[#0F172A]">
                    <div className="rounded-xl">
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    )
}

export default MainLayout
