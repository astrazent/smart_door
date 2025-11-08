import React from 'react'
import { useAlert } from '~/contexts/AlertContext'

const TestAlert = () => {
    const { showAlert } = useAlert()

    const handleSuccess = () => {
        // Cú pháp: showAlert(message, { type: '...', duration: ... })
        showAlert('Sản phẩm đã được thêm vào Giỏ hàng', { type: 'success' })
    }

    const handleError = () => {
        showAlert('Không thể kết nối tới máy chủ', {
            type: 'error',
            duration: 3000,
        })
    }

    const handleInfo = () => {
        showAlert('Đơn hàng sẽ được giao trong 3-5 ngày', {
            type: 'info',
            duration: 2500,
        })
    }

    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            <button
                onClick={handleSuccess}
                style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >
                Thêm (Thành công)
            </button>

            <button
                onClick={handleError}
                style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >
                Test (Thất bại)
            </button>

            <button
                onClick={handleInfo}
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >
                Test (Thông tin)
            </button>
        </div>
    )
}

export default TestAlert
