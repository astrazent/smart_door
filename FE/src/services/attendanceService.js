import api from './api'

export const listAttendance = async params => {
    const res = await api.get('/attendance', { params })
    return res.data
}
