import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

const SuccessIcon = () => (
    <svg
        className="w-20 h-20 text-teal-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const ErrorIcon = () => (
    <svg
        className="w-20 h-20 text-red-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
)

const InfoIcon = () => (
    <svg
        className="w-20 h-20 text-blue-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
)
const Alert = ({ message, type = 'success', duration = 2000, onClose }) => {
    const [isFadingOut, setIsFadingOut] = useState(false)

    useEffect(() => {
        const fadeOutTimer = setTimeout(
            () => setIsFadingOut(true),
            duration - 300
        )
        const closeTimer = setTimeout(() => onClose(), duration)
        return () => {
            clearTimeout(fadeOutTimer)
            clearTimeout(closeTimer)
        }
    }, [duration, onClose])

    const renderIcon = () => {
        switch (type) {
            case 'success':
                return <SuccessIcon />
            case 'error':
                return <ErrorIcon />
            case 'info':
                return <InfoIcon />
            default:
                return <SuccessIcon />
        }
    }

    return ReactDOM.createPortal(
        <div
            className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-300 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="flex flex-col items-center justify-center bg-black/80 text-white p-8 rounded-lg shadow-xl min-w-[350px] min-h-[200px]">
                {renderIcon()}
                <p className="mt-6 text-center font-semibold text-lg">
                    {message}
                </p>
            </div>
        </div>,
        document.body
    )
}

export default Alert
