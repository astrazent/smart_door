// src/pages/TestReduxCards.jsx
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    setCards,
    addCard,
    updateCard,
    removeCard,
    clearCards,
} from '~/redux/reducers/cardReducer'

const TestReduxCards = () => {
    const dispatch = useDispatch()
    const cards = useSelector(state => state.cards.cards)

    const [newCardName, setNewCardName] = useState('Card Mới')
    const [updateId, setUpdateId] = useState('')
    const [updateName, setUpdateName] = useState('Card Cập Nhật')
    const [removeId, setRemoveId] = useState('')

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Redux Cards Demo</h2>

            {/* Danh sách thẻ */}
            <div>
                <h3>Danh sách thẻ:</h3>
                {cards.length === 0 ? (
                    <p>Chưa có thẻ nào</p>
                ) : (
                    <ul>
                        {cards.map(card => (
                            <li key={card.id}>
                                {card.id} - {card.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Thêm thẻ mới */}
            <div>
                <h3>Thêm thẻ:</h3>
                <input
                    type="text"
                    value={newCardName}
                    onChange={e => setNewCardName(e.target.value)}
                    placeholder="Tên thẻ mới"
                />
                <button
                    onClick={() =>
                        dispatch(
                            addCard({
                                id: Date.now().toString(),
                                name: newCardName,
                            })
                        )
                    }
                >
                    Thêm
                </button>
            </div>

            {/* Cập nhật thẻ */}
            <div>
                <h3>Cập nhật thẻ:</h3>
                <input
                    type="text"
                    value={updateId}
                    onChange={e => setUpdateId(e.target.value)}
                    placeholder="ID thẻ cần cập nhật"
                />
                <input
                    type="text"
                    value={updateName}
                    onChange={e => setUpdateName(e.target.value)}
                    placeholder="Tên mới"
                />
                <button
                    onClick={() =>
                        dispatch(updateCard({ id: updateId, name: updateName }))
                    }
                >
                    Cập nhật
                </button>
            </div>

            {/* Xóa thẻ */}
            <div>
                <h3>Xóa thẻ:</h3>
                <input
                    type="text"
                    value={removeId}
                    onChange={e => setRemoveId(e.target.value)}
                    placeholder="ID thẻ cần xóa"
                />
                <button onClick={() => dispatch(removeCard(removeId))}>
                    Xóa
                </button>
            </div>

            {/* Xóa tất cả thẻ */}
            <div>
                <h3>Clear tất cả thẻ:</h3>
                <button onClick={() => dispatch(clearCards())}>Clear</button>
            </div>
        </div>
    )
}

export default TestReduxCards
