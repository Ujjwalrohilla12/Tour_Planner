'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MyTour() {
    const [myTrips, setMyTrips] = useState<any[]>([])
    
    useEffect(() => {
        const savedTrips = localStorage.getItem('myTrips')
        if (savedTrips) {
            setMyTrips(JSON.parse(savedTrips))
        }
    }, [])
    
    const deleteTrip = (index: number) => {
        const updatedTrips = myTrips.filter((_, i) => i !== index)
        setMyTrips(updatedTrips)
        localStorage.setItem('myTrips', JSON.stringify(updatedTrips))
    }
    
    return (
        <div className='px-10 md:px-24 lg:px-48 py-10'>
            <h2 className='font-bold text-3xl mb-8'></h2>

            {myTrips?.length == 0 ? (
                <div className='text-center py-20'>
                    <h2 className='text-xl mb-4'>You don't have any tour plan created!</h2>
                    <Link href='/create-new-trip'>
                        <Button>Create New Tour</Button>
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {myTrips.map((trip: any, index) => (
                        <div key={index} className='border rounded-lg p-4 relative'>
                            <button 
                                onClick={() => deleteTrip(index)}
                                className='absolute top-2 right-2 text-red-500 hover:text-red-700'
                            >
                                ✕
                            </button>
                            <h3 className='font-bold text-lg'>{trip.destination}</h3>
                            <p className='text-gray-600'>{trip.days} Days</p>
                            <p className='text-gray-600'>{trip.budget} Budget</p>
                            <p className='text-gray-600'>{trip.travelers} Travelers</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}