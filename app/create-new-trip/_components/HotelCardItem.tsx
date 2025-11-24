"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ExternalLink, Star, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Hotel } from './ChatBox'
import axios from 'axios'
import Link from 'next/link'
import { formatPriceText } from '@/lib/currency'

type Props={
    hotel:Hotel
}

function HotelCardItem({hotel}:Props) {

    const[photoUrl,setPhotoUrl]=useState<string>();

    useEffect(()=>{
        hotel&&GetGooglePlaceDetail();
    },[hotel])

    const GetGooglePlaceDetail = async () => {
        try {
            const result = await axios.post('/api/google-place-detail', {
                placeName: hotel?.hotel_name
            });
            
            if (result?.data?.error) {
                console.warn('Google Places API error for hotel:', result.data.error);
            }
            
            // Handle both old string format and new object format
            if (result?.data?.url && typeof result.data.url === 'string' && result.data.url.trim() !== '') {
                setPhotoUrl(result.data.url);
            } else if (result?.data && typeof result.data === 'string' && result.data.trim() !== '') {
                setPhotoUrl(result.data);
            }
        } catch (error) {
            console.error('Error fetching hotel place details:', error);
            // Silently fail - will use placeholder image
        }
    }
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow'>
        {/* Image Section */}
        <div className='relative w-full h-40'>
            <Image
                src={photoUrl || '/placeholder.svg'}
                alt={hotel?.hotel_name || 'Hotel Image'}
                fill
                className='object-cover rounded-t-xl'
                />
        </div>
        
        {/* Content Section */}
        <div className='flex flex-col gap-2 p-3'>
            <h3 className='font-semibold text-base text-gray-900'>{hotel?.hotel_name}</h3>
            <p className='text-gray-600 text-sm line-clamp-2'>{hotel.hotel_address}</p>
            
            {/* Price and Rating Row */}
            <div className='flex justify-between items-center mt-1'>
                <div className='flex items-center gap-1 text-green-600 text-sm'>
                    <span className='text-green-600'>💰</span>
                    <span>{formatPriceText(hotel.price_per_night)}</span>
                </div>
                <div className='flex items-center gap-1 text-yellow-500 text-sm'>
                    <Star className="w-4 h-4 fill-current" />
                    <span>{hotel.rating}</span>
                </div>
            </div>
            
            {/* View on Map Button */}
            <Link href={'https://www.google.com/maps/search/?api=1&query=' + hotel?.hotel_name} target='_blank' className="mt-2">
                <Button variant={'outline'} size={'sm'} className='w-full text-sm border-gray-300 hover:bg-gray-50'>
                    <MapPin className="w-4 h-4 mr-1" />
                    View on Map
                    <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
            </Link>
        </div>
    </div>
  )
}

export default HotelCardItem