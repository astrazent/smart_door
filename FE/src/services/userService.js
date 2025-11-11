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

export const registerUser = async data => {
    const res = await api.post('/user/register', data)
    return res.data
}

export const loginUser = async data => {
    const res = await api.post('/user/login', data)
    return res.data
}

export const verifyUser = async () => {
    const res = await api.get('/user/verify')
    return res.data
}

export const logoutUser = async () => {
    const res = await api.post('/user/logout')
    return res.data
}
