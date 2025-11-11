import React, { useState } from 'react'
import { useListUsers } from '~/hooks/useUser'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { saveNewCard } from '~/services/espService'

const NewCardModal = ({ uid, doorCode, onClose }) => {
    const [editableUid, setEditableUid] = useState(uid)
    const [selectedUserId, setSelectedUserId] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const { data: usersData, isLoading, isError } = useListUsers()

    const handleAssign = async () => {
        if (!editableUid) {
            toast.warn('Vui lòng nhập UID thẻ.')
            return
        }

        setIsSaving(true)
        try {
            const data = await saveNewCard({
                user_id: selectedUserId || null,
                card_uid: editableUid,
            })
            if (data.status === 'success') {
                toast.success(data.message || 'Gán thẻ thành công!')
                onClose()
            } else {
                toast.warn(data.message || 'Có lỗi xảy ra khi gán thẻ.')
            }
        } catch (err) {
            let errMsg = 'Đã có lỗi xảy ra'
            if (err?.message) errMsg = err.message
            else if (err?.response?.data?.message)
                errMsg = err.response.data.message
            toast.error(errMsg)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            className="fixed inset-0 flex items-center justify-center z-50"
        >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md z-50">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Gán thẻ mới
                </h3>
                <div className="mb-4">
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        UID Thẻ:
                    </label>
                    <input
                        type="text"
                        value={editableUid}
                        onChange={e => setEditableUid(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="user-select"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Chọn người dùng để gán thẻ (tùy chọn):
                    </label>
                    {isLoading && <p>Đang tải danh sách người dùng...</p>}
                    {isError && <p>Không thể tải danh sách người dùng.</p>}
                    {usersData && (
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={e => setSelectedUserId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        >
                            <option value="">
                                -- Không gán cho user nào --
                            </option>
                            {usersData.data.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.full_name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                        disabled={isSaving}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleAssign}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Đang gán...' : 'Gán thẻ'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewCardModal
