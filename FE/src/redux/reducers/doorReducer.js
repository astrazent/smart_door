import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selectedDoor: null,
}

const doorSlice = createSlice({
    name: 'door',
    initialState,
    reducers: {
        setSelectedDoor: (state, action) => {
            const door = action.payload
            state.selectedDoor = {
                id: door.id,
                door_code: door.door_code,
                name: door.name,
                location: door.location,
                server_domain: door.server_domain,
                is_active: door.is_active,
                current_status: door.current_status,
                last_updated: door.last_updated,
            }
        },
        clearSelectedDoor: state => {
            state.selectedDoor = null
        },
        updateSelectedDoor: (state, action) => {
            if (!state.selectedDoor) return
            const updated = action.payload
            state.selectedDoor = { ...state.selectedDoor, ...updated }
        },
    },
})

export const { setSelectedDoor, clearSelectedDoor, updateSelectedDoor } =
    doorSlice.actions
export default doorSlice.reducer
