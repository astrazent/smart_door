import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BACKEND || 'http://localhost:8027/',
    withCredentials: true,
})

export default api
