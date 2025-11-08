import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    history: [],
}

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        setHistory: (state, action) => {
            state.history = action.payload || []
        },
        addHistory: (state, action) => {
            state.history.unshift(action.payload)
        },
        updateHistory: (state, action) => {
            const updated = action.payload
            state.history = state.history.map(h =>
                h.id === updated.id ? { ...h, ...updated } : h
            )
        },
        removeHistory: (state, action) => {
            const id = action.payload
            state.history = state.history.filter(h => h.id !== id)
        },
        clearHistory: state => {
            state.history = []
        },
    },
})

export const {
    setHistory,
    addHistory,
    updateHistory,
    removeHistory,
    clearHistory,
} = historySlice.actions
export default historySlice.reducer
