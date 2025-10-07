import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://api.your-iot-system.com', // Thay thế bằng URL API của bạn
    headers: {
        'Content-Type': 'application/json',
    },
})

export const getDoorStatus = () => {
    return apiClient.get('/door/status')
}

export const updateDoorStatus = status => {
    return apiClient.post('/door/status', { status }) // status: 'lock' or 'unlock'
}
