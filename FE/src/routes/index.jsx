import MainLayout from '~/layouts/MainLayout'
import TestAlert from '~/pages/TestAlert'
import Dashboard from '~/pages/Dashboard'
import TestHook from '~/pages/TestHook'
import TestRedux from '~/pages/TestRedux'
// ✅ Danh sách routes chính
export const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'test-alert',
                element: <TestAlert />,
            },
            {
                path: 'test-hook',
                element: <TestHook />,
            },
            {
                path: 'test-redux',
                element: <TestRedux />,
            },
        ],
    },
]
