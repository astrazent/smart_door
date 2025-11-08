import React, { useState } from 'react'
import {
    useListCards,
    useGetCardById,
    useGetCardByUid,
    useCreateCard,
    useUpdateCard,
    useDeleteCard,
} from '~/hooks/useCard'
import { useListDoorUserHistory } from '~/hooks/useHistory' // ✅ import hook mới

const CardPage = () => {
    const [cardId, setCardId] = useState('')
    const [cardUid, setCardUid] = useState('')
    const [newCardName, setNewCardName] = useState('Card Mới')
    const [updateCardName, setUpdateCardName] = useState('Card Cập Nhật')

    // List cards
    const { data: cardsData, isLoading: isLoadingCards } = useListCards({
        page: 1,
        limit: 5,
    })

    // Lấy danh sách lịch sử cửa - người dùng
    const { data: doorUserHistory, isLoading: isLoadingHistory } =
        useListDoorUserHistory({ limit: 50 })

    // Get card by ID
    const { data: cardById } = useGetCardById(cardId)

    // Get card by UID
    const { data: cardByUid } = useGetCardByUid(cardUid)

    // Mutations
    const createCardMutation = useCreateCard()
    const updateCardMutation = useUpdateCard()
    const deleteCardMutation = useDeleteCard()

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>React Query Card Hooks Demo</h2>

            {/* List Cards */}
            <div>
                <h3>Danh sách thẻ:</h3>
                {isLoadingCards ? (
                    <p>Loading...</p>
                ) : (
                    <ul>
                        {cardsData?.data?.map(card => (
                            <li key={card.id}>
                                {card.id} - {card.name} - {card.uid}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ✅ Test hook mới - Lịch sử cửa/người dùng */}
            <div>
                <h3>Lịch sử mở cửa (door-user history):</h3>
                {isLoadingHistory ? (
                    <p>Đang tải lịch sử...</p>
                ) : (
                    <pre>{JSON.stringify(doorUserHistory, null, 2)}</pre>
                )}
            </div>

            {/* Get Card by ID */}
            <div>
                <h3>Lấy thẻ theo ID:</h3>
                <input
                    type="text"
                    placeholder="Nhập ID"
                    value={cardId}
                    onChange={e => setCardId(e.target.value)}
                />
                <pre>{cardById && JSON.stringify(cardById, null, 2)}</pre>
            </div>

            {/* Get Card by UID */}
            <div>
                <h3>Lấy thẻ theo UID:</h3>
                <input
                    type="text"
                    placeholder="Nhập UID"
                    value={cardUid}
                    onChange={e => setCardUid(e.target.value)}
                />
                <pre>{cardByUid && JSON.stringify(cardByUid, null, 2)}</pre>
            </div>

            {/* Create Card */}
            <div>
                <h3>Thêm thẻ mới:</h3>
                <input
                    type="text"
                    placeholder="Tên thẻ mới"
                    value={newCardName}
                    onChange={e => setNewCardName(e.target.value)}
                />
                <button
                    onClick={() =>
                        createCardMutation.mutate({
                            card_uid: `UID_${Date.now()}`,
                            user_id: 3,
                            is_active: true,
                        })
                    }
                >
                    Thêm
                </button>
                {createCardMutation.isLoading && <p>Đang tạo...</p>}
                {createCardMutation.data && (
                    <pre>
                        {JSON.stringify(createCardMutation.data, null, 2)}
                    </pre>
                )}
            </div>

            {/* Update Card */}
            <div>
                <h3>Cập nhật thẻ:</h3>
                <input
                    type="text"
                    placeholder="ID thẻ cần cập nhật"
                    value={cardId}
                    onChange={e => setCardId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tên mới"
                    value={updateCardName}
                    onChange={e => setUpdateCardName(e.target.value)}
                />
                <button
                    onClick={() =>
                        updateCardMutation.mutate({
                            id: cardId,
                            data: { name: updateCardName },
                        })
                    }
                >
                    Cập nhật
                </button>
                {updateCardMutation.isLoading && <p>Đang cập nhật...</p>}
                {updateCardMutation.data && (
                    <pre>
                        {JSON.stringify(updateCardMutation.data, null, 2)}
                    </pre>
                )}
            </div>

            {/* Delete Card */}
            <div>
                <h3>Xóa thẻ:</h3>
                <input
                    type="text"
                    placeholder="ID thẻ cần xóa"
                    value={cardId}
                    onChange={e => setCardId(e.target.value)}
                />
                <button onClick={() => deleteCardMutation.mutate(cardId)}>
                    Xóa
                </button>
                {deleteCardMutation.isLoading && <p>Đang xóa...</p>}
                {deleteCardMutation.data && (
                    <pre>
                        {JSON.stringify(deleteCardMutation.data, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    )
}

export default CardPage
