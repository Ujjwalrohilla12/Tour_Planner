import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TripDurationProps {
  onSelectedOption?: (value: string) => void;
}

function TripDuration({ onSelectedOption }: TripDurationProps) {
  const [days, setDays] = useState<number>(7);

  const decrement = () => setDays((d)=> Math.max(1, d-1));
  const increment = () => setDays((d)=> Math.min(30, d+1));
  const confirm = () => onSelectedOption?.(`${days} Days`);

  return (
    <div className='border rounded-xl p-5 flex flex-col gap-5 items-center'>
      <h3 className='font-semibold text-lg text-center'>How many days do you want to travel?</h3>
      <div className='flex items-center gap-6'>
        <button
          className='h-10 w-10 flex items-center justify-center rounded-full border text-lg'
          onClick={decrement}
          aria-label='decrease days'
        >
          –
        </button>
        <span className='text-xl font-bold'>{days} Days</span>
        <button
          className='h-10 w-10 flex items-center justify-center rounded-full border text-lg'
          onClick={increment}
          aria-label='increase days'
        >
          +
        </button>
      </div>
      <Button onClick={confirm} className='px-6'>Confirm</Button>
    </div>
  )
}

export default TripDuration


