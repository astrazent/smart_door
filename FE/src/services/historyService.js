import api from './api'

export const listHistory = async params => {
    const res = await api.get('/history', { params })
    return res.data
}

export const addHistory = async data => {
    const res = await api.post('/history', data)
    return res.data
}

export const deleteHistory = async id => {
    const res = await api.delete(`/history/${id}`)
    return res.data
}

export const deleteAllHistory = async () => {
    const res = await api.delete('/history')
    return res.data
}

export const listDoorUserHistory = async (params = { limit: 50 }) => {
    const res = await api.get('/history/list_door_user', { params })
    return res.data
}
