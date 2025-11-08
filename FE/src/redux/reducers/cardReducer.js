import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cards: [],
}

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        setCards: (state, action) => {
            state.cards = action.payload || []
        },
        addCard: (state, action) => {
            state.cards.push(action.payload)
        },
        updateCard: (state, action) => {
            const updated = action.payload
            state.cards = state.cards.map(card =>
                card.id === updated.id ? { ...card, ...updated } : card
            )
        },
        removeCard: (state, action) => {
            const id = action.payload
            state.cards = state.cards.filter(card => card.id !== id)
        },
        clearCards: state => {
            state.cards = []
        },
    },
})

export const { setCards, addCard, updateCard, removeCard, clearCards } =
    cardsSlice.actions
export default cardsSlice.reducer
