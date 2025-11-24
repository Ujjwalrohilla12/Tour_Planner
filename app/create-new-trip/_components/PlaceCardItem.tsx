"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Clock, ExternalLink, Ticket, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Activity } from './ChatBox'
import axios from 'axios'
import { formatPriceText } from '@/lib/currency'

type Props = {
  activity: Activity
}
function PlaceCardItem({ activity }: Props) {

  const [photoUrl, setPhotoUrl] = useState<string>();

  useEffect(() => {
    activity && GetGooglePlaceDetail();
  }, [activity])

  const GetGooglePlaceDetail = async () => {
    try {
      const result = await axios.post('/api/google-place-detail', {
        placeName: activity?.place_name + ":" + activity?.place_address
      });

      if (result?.data?.error) {
        console.warn('Google Places API error:', result.data.error);
        return;
      }

      // Handle both old string format and new object format
      if (result?.data?.url && typeof result.data.url === 'string' && result.data.url.trim() !== '') {
        setPhotoUrl(result.data.url);
      } else if (result?.data && typeof result.data === 'string' && result.data.trim() !== '') {
        setPhotoUrl(result.data);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      // Silently fail - will use placeholder image
    }
  }

  // Function to format time and extract period
  const formatTimeDisplay = (timeString: string) => {
    if (!timeString) return { period: '', fullTime: timeString };

    const lowerTime = timeString.toLowerCase();

    // Check for combined periods like "Morning to Afternoon"
    if (lowerTime.includes('morning') && lowerTime.includes('afternoon')) {
      return { period: 'Morning to Afternoon', fullTime: timeString };
    } else if (lowerTime.includes('afternoon') && lowerTime.includes('evening')) {
      return { period: 'Afternoon to Evening', fullTime: timeString };
    } else if (lowerTime.includes('morning') && lowerTime.includes('evening')) {
      return { period: 'Morning to Evening', fullTime: timeString };
    }
    // Single periods
    else if (lowerTime.includes('morning') || lowerTime.includes('am') || lowerTime.includes('6 am') || lowerTime.includes('7 am') || lowerTime.includes('8 am') || lowerTime.includes('9 am') || lowerTime.includes('10 am') || lowerTime.includes('11 am')) {
      return { period: 'Morning', fullTime: timeString };
    } else if (lowerTime.includes('afternoon') || lowerTime.includes('12 pm') || lowerTime.includes('1 pm') || lowerTime.includes('2 pm') || lowerTime.includes('3 pm') || lowerTime.includes('4 pm') || lowerTime.includes('5 pm')) {
      return { period: 'Afternoon', fullTime: timeString };
    } else if (lowerTime.includes('evening') || lowerTime.includes('6 pm') || lowerTime.includes('7 pm') || lowerTime.includes('8 pm') || lowerTime.includes('9 pm')) {
      return { period: 'Evening', fullTime: timeString };
    } else if (lowerTime.includes('night') || lowerTime.includes('10 pm') || lowerTime.includes('11 pm')) {
      return { period: 'Night', fullTime: timeString };
    }

    return { period: '', fullTime: timeString };
  }



  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div className="relative w-full h-40">
        <Image
          src={photoUrl || '/placeholder.svg'}
          width={400}
          height={160}
          alt={activity.place_name}
          className='object-cover w-full h-full rounded-t-xl'
        />
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col gap-2">
        <h3 className='font-semibold text-base text-gray-900'>{activity?.place_name}</h3>
        <p className='text-gray-600 text-sm line-clamp-2'>{activity.place_details}</p>

        {/* Pricing */}
        <div className='flex items-center gap-1 text-green-600 text-sm'>
          <Ticket className="w-4 h-4" />
          <span>{formatPriceText(activity.ticket_pricing)}</span>
        </div>

        {/* Best Time */}
        <div className='flex items-center gap-1 text-blue-600 text-sm'>
          <Clock className="w-4 h-4" />
          <span className="font-medium">
            {formatTimeDisplay(activity.best_time_to_visit).period ?
              `Best Time: ${formatTimeDisplay(activity.best_time_to_visit).period}` :
              formatTimeDisplay(activity.best_time_to_visit).fullTime
            }
          </span>
        </div>

        {/* View on Map Button */}
        <Link href={'https://www.google.com/maps/search/?api=1&query=' + activity?.place_name} target='_blank' className="mt-2">
          <Button size={'sm'} variant={'outline'} className='w-full text-sm border-gray-300 hover:bg-gray-50'>
            <MapPin className="w-4 h-4 mr-1" />
            View on Map
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default PlaceCardItem