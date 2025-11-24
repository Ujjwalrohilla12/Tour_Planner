'use client';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Loader } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useTripDetail, useUserDetail } from '@/app/provider'
import { v4 as uuidv4 } from 'uuid'
import EmptyBoxState from './EmptyBoxState'
import GroupSize from './GroupSize'
import Budget from './Budget'
import TripDuration from './SelectDays'
import FinalUi from './FinalUi'

type Message = {
  role: string,
  content: string,
  ui?: string,
}

export type TripInfo = {
  budget: string,
  destination: string,
  duration: string,
  group_size: string,
  origin: string,
  hotels: Hotel[],
  itinerary: Itinerary[]
}

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  description: string;
};

export type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo>();
  // @ts-ignore - Convex will generate this after schema update
  const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
  const userDetailContext = useUserDetail();
  const userDetail = userDetailContext?.userDetail;
  //@ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

  // Clear any existing trip data when component mounts for fresh start
  useEffect(() => {
    setTripDetailInfo(null);
    setTripDetail(undefined);
    // Don't add initial message - let EmptyBoxState handle the initial UI
  }, []); // Empty dependency array means this runs only on mount

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const onSend = async () => {
    if (!userInput?.trim() || loading) return;

    console.log('ChatBox - onSend called with isFinal:', isFinal);
    console.log('ChatBox - userInput:', userInput);

    setLoading(true);
    const currentInput = userInput;
    setUserInput('');

    const newMsg: Message = {
      role: 'user',
      content: currentInput
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    console.log('ChatBox - Sending API request with isFinal:', isFinal);

    try {
      const result = await axios.post('/api/aimodel', {
        messages: updatedMessages,
        isFinal: isFinal
      });

      // Handle final state - extract trip plan data and save to database
      if (isFinal) {
        const apiResponse = result?.data;

        // Combine trip_plan and itinerary data
        const combinedTripData = {
          ...apiResponse?.trip_plan,
          itinerary: apiResponse?.itinerary || []
        };

        // Check if we have valid trip data
        const hasValidData = combinedTripData && (
          (combinedTripData.hotels && Array.isArray(combinedTripData.hotels) && combinedTripData.hotels.length > 0) ||
          (combinedTripData.itinerary && Array.isArray(combinedTripData.itinerary) && combinedTripData.itinerary.length > 0)
        );

        // Only use real data from API, no fallback test data
        if (hasValidData) {
          console.log('Setting trip data - Origin:', combinedTripData.origin);
          console.log('Setting trip data - Destination:', combinedTripData.destination);
          setTripDetail(combinedTripData);
          setTripDetailInfo(combinedTripData);
          
          // Save to database
          const tripId = uuidv4();
          if (userDetail?._id) {
            try {
              await SaveTripDetail({
                tripDetail: combinedTripData,
                tripId: tripId,
                uid: userDetail._id
              });
              console.log('Trip saved successfully');
            } catch (saveError) {
              console.error('Error saving trip:', saveError);
            }
          }
          
          // Save to localStorage for My Tour page
          const existingTrips = JSON.parse(localStorage.getItem('myTrips') || '[]');
          const newTrip = {
            destination: combinedTripData.destination,
            days: combinedTripData.duration,
            budget: combinedTripData.budget,
            travelers: combinedTripData.group_size,
            id: tripId,
            createdAt: new Date().toISOString()
          };
          existingTrips.push(newTrip);
          localStorage.setItem('myTrips', JSON.stringify(existingTrips));
        } else {
          console.log("No valid data received from API - trip generation may have failed");
          // Show error message to user
          setMessages((prev: Message[]) => [...prev, {
            role: 'assistant',
            content: 'I had trouble generating your trip plan. Let me try again. Please provide: source city, destination, number of days, budget (low/medium/high), and group size (solo/couple/family/friends).'
          }]);
          return;
        }
      }

      // Only add assistant message if not in final state
      if (!isFinal) {
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: result?.data?.resp || 'No response received',
          ui: result?.data?.ui || null
        }]);
      }
    } catch (error: any) {
      console.error('Error:', error);
      let errorMessage = 'Error: Could not get response. Please try again.';

      if (error.response?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.response?.data?.resp) {
        errorMessage = error.response.data.resp;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleUISelection = async (value: string) => {
    if (loading) return;

    const newMsg: Message = {
      role: 'user',
      content: value
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const result = await axios.post('/api/aimodel', {
        messages: updatedMessages,
        isFinal: isFinal
      });

      const content = result?.data?.resp || 'No response received';

      // Handle final state - extract trip plan data and save to database
      if (isFinal) {
        const apiResponse = result?.data;
        console.log("HandleUISelection - Full API Response:", apiResponse);

        // Combine trip_plan and itinerary data
        const combinedTripData = {
          ...apiResponse?.trip_plan,
          itinerary: apiResponse?.itinerary || []
        };

        console.log("HandleUISelection - Combined trip data:", combinedTripData);
        console.log("HandleUISelection - API Response trip_plan:", apiResponse?.trip_plan);
        console.log("HandleUISelection - API Response itinerary:", apiResponse?.itinerary);

        // Check if we have valid trip data
        const hasValidData = combinedTripData && (
          (combinedTripData.hotels && Array.isArray(combinedTripData.hotels) && combinedTripData.hotels.length > 0) ||
          (combinedTripData.itinerary && Array.isArray(combinedTripData.itinerary) && combinedTripData.itinerary.length > 0)
        );

        console.log("HandleUISelection - Has valid trip data:", hasValidData);

        // Only use real data from API, no fallback test data
        if (hasValidData) {
          console.log("HandleUISelection - Valid trip data received from API");
          setTripDetail(combinedTripData);
          setTripDetailInfo(combinedTripData);
          console.log("HandleUISelection - Final trip detail set in global context:", combinedTripData);
          
          // Save to database
          const tripId = uuidv4();
          if (userDetail?._id) {
            try {
              await SaveTripDetail({
                tripDetail: combinedTripData,
                tripId: tripId,
                uid: userDetail._id
              });
              console.log('Trip saved successfully');
            } catch (saveError) {
              console.error('Error saving trip:', saveError);
            }
          }
        } else {
          console.log("HandleUISelection - No valid data received from API - trip generation may have failed");
          // Show error message to user
          setMessages((prev: Message[]) => [...prev, {
            role: 'assistant',
            content: 'I had trouble generating your trip plan. Let me try again. Please provide: source city, destination, number of days, budget (low/medium/high), and group size (solo/couple/family/friends).'
          }]);
          return;
        }
      }

      // Only add assistant message if not in final state
      if (!isFinal) {
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: content,
          ui: result?.data?.ui || null
        }]);
      }
    } catch (error: any) {
      console.error('Error:', error);
      let errorMessage = 'Error: Could not get response. Please try again.';

      if (error.response?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.response?.data?.resp) {
        errorMessage = error.response.data.resp;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTrip = () => {
    console.log('ChatBox - handleViewTrip called');
    console.log('ChatBox - Current tripDetail:', tripDetail);
    console.log('ChatBox - Current tripDetailInfo:', tripDetailInfo);
    
    // Only display real trip data, no fallback
    if (tripDetail) {
      console.log('ChatBox - Displaying real trip data');
      setTripDetailInfo(tripDetail);
    } else {
      console.log('ChatBox - No trip data available to display');
    }
  };

  const RenderGenerativeUi = (ui: string) => {
    const key = (ui || '').toLowerCase();
    if (key === 'budget') {
      return <Budget onSelectedOption={handleUISelection} />
    } else if (key === 'groupsize') {
      return <GroupSize onSelectedOption={handleUISelection} />
    } else if (key === 'tripduration') {
      return <TripDuration onSelectedOption={handleUISelection} />
    } else if (key === 'final') {
      return <FinalUi viewTrip={handleViewTrip} disable={!tripDetail} tripDetail={tripDetail} />
    }
    return null;
  };

  useEffect(() => {
    // Check if last message indicates 'Final' UI
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.ui && (lastMsg.ui.toLowerCase() === 'final')) {
      console.log('All details collected! Setting isFinal to true, last message:', lastMsg);
      setIsFinal(true);
      setUserInput('Generate my trip plan!');
    }
  }, [messages]);

  useEffect(() => {
    // Auto-trigger onSend when isFinal is true and userInput is set to trigger message
    if (isFinal && userInput === 'Generate my trip plan!' && !loading) {
      console.log('ChatBox - Auto-triggering final trip generation');
      const timer = setTimeout(() => {
        onSend();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinal, userInput]);

  return (
    <div className='h-[85vh] flex flex-col'>
      {/* Display Message */}
      <section className='flex-1 overflow-y-auto p-4 scrollbar-hide'>
        {messages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <EmptyBoxState onSelectoption={(v: string) => {
              setUserInput(v);
            }} />
          </div>
        ) : (
          messages.map((msg: Message, index) => (
            msg.role === 'user' ?
              <div className='flex justify-end mt-2' key={index}>
                <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                  {msg.content}
                </div>
              </div> :
              <div className='flex justify-start mt-2' key={index}>
                <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
                  {msg.content}
                  {RenderGenerativeUi(msg.ui ?? '')}
                </div>
              </div>
          ))
        )}
        {loading && (
          <div className='flex justify-start mt-2'>
            <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
              <Loader className='animate-spin h-4 w-4' />
            </div>
          </div>
        )}
      </section>
      {/* User Input */}
      <section className='p-4'>
        <div className='border rounded-2xl p-4 relative'>
          <Textarea
            placeholder="Create a trip from delhi to london... (Press Enter to send)"
            className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            value={userInput}
          />

          <Button
            size={'icon'}
            className='absolute bottom-6 right-6'
            onClick={onSend}
            disabled={loading}
          >
            <Send className='h-4 w-4' />
          </Button>
          

        </div>
      </section>
    </div>
  )
}

export default ChatBox
