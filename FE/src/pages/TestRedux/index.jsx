import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, reset } from '~/redux/slices/counterSlice'

export default function TestRedux() {
    const count = useSelector(state => state.counter.value)
    const dispatch = useDispatch()

    return (
        <div className="flex flex-col items-center gap-4 mt-10">
            <h2 className="text-2xl font-semibold">
                Giá trị hiện tại: {count}
            </h2>
            <div className="flex gap-3">
                <button
                    onClick={() => dispatch(increment())}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    + Tăng
                </button>
                <button
                    onClick={() => dispatch(decrement())}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    - Giảm
                </button>
                <button
                    onClick={() => dispatch(reset())}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                    Đặt lại
                </button>
            </div>
        </div>
    )
}
