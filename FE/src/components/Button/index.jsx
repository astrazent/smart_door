import React from 'react'
import './Button.scss'

const Button = ({
    onClick,
    children,
    type = 'button',
    variant = 'primary',
}) => {
    return (
        <button type={type} className={`btn ${variant}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button
