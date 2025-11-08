import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    doors: [],
}

const doorSlice = createSlice({
    name: 'door',
    initialState,
    reducers: {
        setDoors: (state, action) => {
            state.doors = action.payload || []
        },
        addDoor: (state, action) => {
            state.doors.push(action.payload)
        },
        updateDoor: (state, action) => {
            const updated = action.payload
            state.doors = state.doors.map(d =>
                d.id === updated.id ? { ...d, ...updated } : d
            )
        },
        removeDoor: (state, action) => {
            const id = action.payload
            state.doors = state.doors.filter(d => d.id !== id)
        },
        clearDoors: state => {
            state.doors = []
        },
    },
})

export const { setDoors, addDoor, updateDoor, removeDoor, clearDoors } =
    doorSlice.actions
export default doorSlice.reducer
