import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import '~/index.css'
import { AuthProvider } from './contexts/AuthContext'
import { AlertProvider } from './contexts/AlertContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <ThemeProvider>
                        <AlertProvider>
                            <BrowserRouter>
                                <App />
                                <ToastContainer
                                    position="top-right"
                                    autoClose={3000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                />
                            </BrowserRouter>
                        </AlertProvider>
                    </ThemeProvider>
                </AuthProvider>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
)
