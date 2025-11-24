"use client"
import { Timeline } from "@/components/ui/timeline";
import HotelCardItem from './HotelCardItem';
import PlaceCardItem from './PlaceCardItem';
import { Clock } from 'lucide-react';
import { useEffect, useState } from "react";
import { TripInfo } from "./ChatBox";
import { useTripDetail } from "@/app/provider";

function Itinerary() {
    //@ts-ignore
    const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
    const [tripData, setTripData] = useState<TripInfo | null>(null);
    

    
    // Only use trip data from current session context
    useEffect(() => {
        if (tripDetailInfo) {
            setTripData(tripDetailInfo);
        } else {
            // Clear any existing data when context is empty
            setTripData(null);
        }
    }, [tripDetailInfo])

    const data = tripData ? [
        {
            title: "Hotels",
            content: (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {tripData?.hotels && Array.isArray(tripData.hotels) ? 
                        tripData.hotels.map((hotel, index) => (
                            <HotelCardItem key={`hotel-${index}`} hotel={hotel}/>
                        )) : 
                        <div className="text-gray-500">No hotels available</div>
                    }
                </div>
            ),
        },
        ...(tripData?.itinerary && Array.isArray(tripData.itinerary) ? 
            tripData.itinerary.map((dayData: any, index: number) => ({
                title: `Day ${dayData?.day || index + 1}`,
                content: (
                    <div key={`day-content-${dayData?.day || index}`}>
                        <div className="flex items-center gap-2 text-blue-600 text-sm mb-3">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">
                                Best Time: {dayData?.best_time_to_visit_day || 'Not specified'}
                            </span>
                        </div>
                        <p className="text-gray-700 mb-4 font-medium">{dayData?.day_plan}</p>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {dayData?.activities && Array.isArray(dayData.activities) ? 
                                dayData.activities.map((activity: any, actIndex: number) => (
                                    <PlaceCardItem key={`activity-${dayData.day}-${actIndex}`} activity={activity}/>
                                )) : 
                                <div className="text-gray-500">No activities planned for this day</div>
                            }
                        </div>
                    </div>
                )
            })) : []
        )
    ] : [];

    return (
        <div className="relative w-full h-[83vh] overflow-auto">
            {tripData ? (
                <Timeline data={data} tripData={tripData} />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-gray-400 text-lg mb-2">🗺️</div>
                        <h3 className="text-gray-600 font-medium">Your Trip Itinerary</h3>
                        <p className="text-gray-500 text-sm">Start planning your trip to see the itinerary here</p>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Itinerary