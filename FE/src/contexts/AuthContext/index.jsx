import React, { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    // Các hàm login, logout sẽ được thêm ở đây

    const value = { user, setUser }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
