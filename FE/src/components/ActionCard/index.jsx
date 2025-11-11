import React from 'react'
import OpenDoorCard from '../OpenDoorCard'
import GetCardCode from '../GetCardCode'

const ActionCards = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            <OpenDoorCard />
            <GetCardCode />
        </div>
    )
}

export default ActionCards
