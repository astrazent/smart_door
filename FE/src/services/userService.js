import api from './api'

export const createUser = async data => {
    const res = await api.post('/user/create', data)
    return res.data
}

export const listUsers = async params => {
    const res = await api.get('/user', { params })
    return res.data
}

export const getUserById = async id => {
    const res = await api.get(`/user/${id}`)
    return res.data
}

export const updateUser = async (id, data) => {
    const res = await api.patch(`/user/${id}`, data)
    return res.data
}

export const deleteUser = async id => {
    const res = await api.delete(`/user/${id}`)
    return res.data
}
