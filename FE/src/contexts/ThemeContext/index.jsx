import React, { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light')

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        const userPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches

        if (savedTheme) {
            setTheme(savedTheme)
        } else if (userPrefersDark) {
            setTheme('dark')
        }
    }, [])

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove('light', 'dark')
        root.classList.add(theme)

        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
