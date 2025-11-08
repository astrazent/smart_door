import api from './api'

export const createCard = async data => {
    const res = await api.post('/card', data)
    return res.data
}

export const listCards = async params => {
    const res = await api.get('/card', { params })
    return res.data
}

export const listCardUsers = async params => {
    const res = await api.get('/card/card_user', { params })
    return res.data
}

export const getCardById = async id => {
    const res = await api.get(`/card/${id}`)
    return res.data
}

export const getCardByUid = async uid => {
    const res = await api.get(`/card/uid/${uid}`)
    return res.data
}

export const updateCard = async (id, data) => {
    const res = await api.patch(`/card/${id}`, data)
    return res.data
}

export const deleteCard = async id => {
    const res = await api.delete(`/card/${id}`)
    return res.data
}
