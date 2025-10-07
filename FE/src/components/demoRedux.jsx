import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, reset } from '~/redux/slices/counterSlice'

function DemoRedux() {
    const count = useSelector(state => state.counter.value)
    const dispatch = useDispatch()

    return (
        <div style={{ padding: '20px' }}>
            <h1>Redux Demo</h1>
            <p>Count: {count}</p>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
            <button onClick={() => dispatch(reset())}>Reset</button>
        </div>
    )
}

export default DemoRedux
