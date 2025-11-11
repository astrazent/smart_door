import api from './api'

export const openDoor = async params => {
    const res = await api.get('esp/door/open', { params })
    return res.data
}

export const closeDoor = async params => {
    const res = await api.get('esp/door/close', { params })
    return res.data
}

export const getDoorStatus = async params => {
    try {
        const res = await api.get('esp/door/status', { params })
        return res.data
    } catch (error) {
        console.error('[API ERROR]', error.message)

        return {
            status: 'error',
            message:
                error.response?.data?.message || 'Không thể lấy trạng thái cửa',
            current_status: null,
            ...params,
        }
    }
}

export const getNewCard = async params => {
    try {
        const res = await api.get('esp/get-new-card', { params })
        return res.data
    } catch (error) {
        console.error('[API ERROR] getNewCard:', error.message)
        return {
            status: 'error',
            message: error.response?.data?.message || 'Không thể lấy UID mới',
            uid: null,
            ...params,
        }
    }
}

export const saveNewCard = async params => {
    try {
        const res = await api.post('esp/save-new-card', params)
        return res.data
    } catch (error) {
        console.error('[API ERROR] saveNewCard:', error.message)
        return {
            status: 'error',
            message: error.response?.data?.message || 'Không thể lưu thẻ mới',
            uid: params?.card_uid || null,
            user_id: params?.user_id || null,
        }
    }
}
