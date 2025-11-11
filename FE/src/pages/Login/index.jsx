import React from 'react'
import { Navigate } from 'react-router-dom'
import LoginForm from '~/components/LoginForm'
import AuthTheme from '~/components/AuthTheme'
import background from '~/assets/bg_frierien_sleeping.jpg'
import icon from '~/assets/smart-door.png'
import { useAuth } from '~/hooks/useUser'

const Login = () => {
    const { data, isLoading } = useAuth()

    if (isLoading) {
        return <div>Đang kiểm tra đăng nhập...</div>
    }

    if (data && data.role) {
        return <Navigate to="/" replace />
    }

    return (
        <AuthTheme mainBgImage={background} iconImage={icon}>
            <LoginForm isAdmin={true} />
        </AuthTheme>
    )
}

export default Login
