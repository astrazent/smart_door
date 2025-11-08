import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: null,
    full_name: '',
    username: '',
    email: '',
    phone: '',
    role: 'member',
    created_at: null,
    updated_at: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const payload = action.payload || {}
            return {
                id: payload.id ?? null,
                full_name: payload.full_name ?? '',
                username: payload.username ?? '',
                email: payload.email ?? '',
                phone: payload.phone ?? '',
                role: payload.role ?? 'member',
                created_at: payload.created_at ?? null,
                updated_at: payload.updated_at ?? null,
            }
        },
        clearUser: () => initialState,
        updateUser: (state, action) => {
            const payload = action.payload || {}
            return { ...state, ...payload }
        },
    },
})

export const { setUser, clearUser, updateUser } = userSlice.actions
export default userSlice.reducer
