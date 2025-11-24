import React from 'react'
import ChatBox from './_components/ChatBox'
import Itinerary from './_components/Itinerary'

function CreateNewTrip() {
  return (
    <div className='h-screen overflow-hidden'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-10 h-full'>
          <div className='overflow-hidden'>
              <ChatBox/>
          </div>
          <div className='overflow-hidden'>
              <Itinerary/>
          </div>
      </div>
    </div>
  )
}

export default CreateNewTrip