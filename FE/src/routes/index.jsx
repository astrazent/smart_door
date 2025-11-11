import MainLayout from '~/layouts/MainLayout'
import TestAlert from '~/pages/TestAlert'
import Dashboard from '~/pages/Dashboard'
import TestHook from '~/pages/TestHook'
import TestRedux from '~/pages/TestRedux'
import Login from '~/pages/Login'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '~/hooks/useUser'

const ProtectedRoute = ({ children }) => {
    const location = useLocation()
    const { data, isLoading } = useAuth()

    if (isLoading) {
        return <div>Đang xác thực...</div>
    }

    if (!data || !data.username) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

function ProtectedLayout() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <Outlet />
            </MainLayout>
        </ProtectedRoute>
    )
}

export const routes = [
    { path: '/login', element: <Login /> },
    { path: '/test-alert', element: <TestAlert /> },
    { path: 'test-hook', element: <TestHook /> },
    { path: 'test-redux', element: <TestRedux /> },
    {
        path: '/',
        element: <ProtectedLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
        ],
    },
]
