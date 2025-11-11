import React, { useState } from 'react'
import Button from '~/components/Button'
import './home.scss'

const Home = () => {
    const [isLocked, setIsLocked] = useState(true)

    const handleToggleLock = () => {
        setIsLocked(!isLocked)
    }

    return (
        <div className="home-container">
            <h1>Smart Door Control</h1>
            <div className={`door-status ${isLocked ? 'locked' : 'unlocked'}`}>
                <h2>Door Status: {isLocked ? 'Locked' : 'Unlocked'}</h2>
            </div>
            <div className="controls">
                <Button
                    onClick={handleToggleLock}
                    variant={isLocked ? 'primary' : 'danger'}
                >
                    {isLocked ? 'Unlock Door' : 'Lock Door'}
                </Button>
                <Button variant="secondary">Check History</Button>
            </div>
        </div>
    )
}

export default Home
