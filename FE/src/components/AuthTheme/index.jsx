import React from 'react'
import './authTheme.scss'

const AuthTheme = ({ children, mainBgImage, iconImage }) => {
    const themeStyles = {
        '--main-bg-url': `url(${mainBgImage})`,

        '--icon-bg-url': `url(${iconImage})`,
    }

    return (
        <main className="auth-theme-container" style={themeStyles}>
            <div className="main-content">{children}</div>
        </main>
    )
}

export default AuthTheme
