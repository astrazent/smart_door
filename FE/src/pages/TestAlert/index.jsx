import React from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function TestAlert() {
    const showSuccess = () => toast.success('Đây là thông báo SUCCESS!')
    const showError = () => toast.error('Đây là thông báo ERROR!')
    const showInfo = () => toast.info('Đây là thông báo INFO!')
    const showWarning = () => toast.warn('Đây là thông báo WARNING!')

    return (
        <div className="p-8 flex flex-col gap-4">
            <h2 className="text-xl font-bold">Test Alert</h2>
            <div className="flex gap-4 flex-wrap">
                <button
                    onClick={showSuccess}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    Success
                </button>
                <button
                    onClick={showError}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Error
                </button>
                <button
                    onClick={showInfo}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Info
                </button>
                <button
                    onClick={showWarning}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                    Warning
                </button>
            </div>
        </div>
    )
}
