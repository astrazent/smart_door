import api from './api'

export const listDoors = async params => {
    const res = await api.get('/door', { params })
    return res.data
}

export const addDoor = async data => {
    const res = await api.post('/door', data)
    return res.data
}

export const updateDoor = async (id, data) => {
    const res = await api.patch(`/door/${id}`, data)
    return res.data
}

export const deleteDoor = async id => {
    const res = await api.delete(`/door/${id}`)
    return res.data
}
