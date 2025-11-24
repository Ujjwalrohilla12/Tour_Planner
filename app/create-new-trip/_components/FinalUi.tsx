import React from 'react'
import { Button } from '@/components/ui/button'
import { Globe2, CheckCircle } from 'lucide-react'

type FinalUiProps = {
  viewTrip?: () => void
  disable?: boolean
  tripDetail?: any
}

function FinalUi({ viewTrip, disable, tripDetail }: FinalUiProps) {
  // More strict check - ensure we have both hotels and itinerary
  const hasCompleteTrip = tripDetail && 
                         tripDetail.hotels && 
                         Array.isArray(tripDetail.hotels) && 
                         tripDetail.itinerary && 
                         Array.isArray(tripDetail.itinerary) &&
                         tripDetail.itinerary.length > 0;

  return (
    <div className='flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-xl border shadow-sm'>
      {hasCompleteTrip ? (
        <CheckCircle className='text-green-500 text-4xl' />
      ) : (
        <Globe2 className='text-primary text-4xl animate-bounce' />
      )}
      <h2 className='mt-3 text-lg font-semibold text-primary'>
        {hasCompleteTrip ? 'Trip Plan Ready!' : 'Planning your dream trip...'}
      </h2>
      <p className='text-gray-500 text-sm text-center mt-1'>
        {hasCompleteTrip 
          ? 'Your personalized itinerary has been generated successfully.'
          : 'Gathering best destinations, activities, and travel details for you.'
        }
      </p>
      <Button 
        disabled={disable || !hasCompleteTrip} 
        onClick={viewTrip} 
        className='mt-2 w-full'
      >
        {hasCompleteTrip ? 'View Trip Details' : 'Generating...'}
      </Button>
    </div>
  )
}

export default FinalUi