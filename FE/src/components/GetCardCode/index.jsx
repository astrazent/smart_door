import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React, { useState } from 'react'
import { FiCreditCard } from 'react-icons/fi'
import { useMutation } from '@tanstack/react-query'
import { getNewCard } from '~/services/espService'
import NewCardModal from '../NewCardModal'

const GetCardCode = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [cardData, setCardData] = useState(null)

    const { mutate: fetchNewCard, isLoading } = useMutation({
        mutationFn: getNewCard,
        onSuccess: data => {
            if (data?.status === 'success' && data?.uid) {
                setCardData(data)
                setIsModalOpen(true)
                toast.success('Quét UID thành công!')
            } else {
                toast.warn(data?.message || 'Không lấy được UID')
            }
        },
        onError: error => {
            toast.error('Lỗi khi lấy thẻ mới!')
        },
    })

    const handleClick = () => {
        if (isLoading) return
        fetchNewCard({ door_code: 'DOOR_MAIN' })
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCardData(null)
    }

    return (
        <>
            <div
                onClick={handleClick}
                className="bg-green-500 dark:bg-green-600 p-8 rounded-2xl shadow-lg flex items-center justify-between transform transition-transform hover:scale-[1.03] cursor-pointer h-36"
            >
                <div className="p-3 bg-white/20 rounded-lg">
                    <FiCreditCard className="text-white" size={28} />
                </div>
                <div className="text-right">
                    <p className="text-white/80 text-sm">Lấy mã thẻ</p>
                    <h4 className="text-3xl font-semibold text-white mt-1">
                        {isLoading ? 'Đang quét...' : 'Tạo mã mới'}
                    </h4>
                </div>
            </div>

            {isModalOpen && cardData && (
                <NewCardModal
                    uid={cardData.uid}
                    doorCode={cardData.door_code}
                    onClose={handleCloseModal}
                />
            )}
        </>
    )
}

export default GetCardCode
