import Home from '~/pages/Home'
import About from '~/pages/About'
import MainLayout from '~/layouts/MainLayout'
import TestAlert from '~/pages/TestAlert'
import TestRedux from '~/pages/TestRedux'

// ✅ Danh sách routes chính
export const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'test-alert',
                element: <TestAlert />,
            },
            {
                path: 'test-redux',
                element: <TestRedux />,
            },
        ],
    },
]
