import React from 'react'
import { useRegisterUser, useLoginUser } from '~/hooks/useUser'

export default function TestAuthHooks() {
    const registerMutation = useRegisterUser()
    const loginMutation = useLoginUser()

    const handleRegister = () => {
        registerMutation.mutate(
            {
                full_name: 'Nguyen Van A',
                username: 'nguyens',
                email: 'nguyens@example.com',
                phone: '0901000001',
                password: '12345678',
                role: 'admin',
            },
            {
                onSuccess: res => console.log('Registered:', res),
                onError: err => console.error(err),
            }
        )
    }

    const handleLogin = () => {
        loginMutation.mutate(
            {
                identifier: 'nguyens',
                password: '12345678',
            },
            {
                onSuccess: res => console.log('Logged in:', res),
                onError: err => console.error(err),
            }
        )
    }

    return (
        <div>
            <button onClick={handleRegister}>Test Register</button>
            <button onClick={handleLogin}>Test Login</button>
        </div>
    )
}
