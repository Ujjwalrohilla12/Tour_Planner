"use client"
import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Globe2, ArrowDown } from 'lucide-react'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'


export const suggestions=[
  {
    title:'Create a Trip',
    icon:<Globe2 className='text-blue-400 h-5 w-5'/>
  },
  {
    title:'Inspire me where to go',
    icon:<Globe2 className='text-green-500 h-5 w-5'/>
  },
  {
    title:'Discover Hidden gems',
    icon:<Globe2 className='text-blue-500 h-5 w-5'/>
  },
  {
    title:'Adventure Destinations',
    icon:<Globe2 className='text-yellow-600 h-5 w-5'/>
  }
]

function HeroSection() {

  const {user}=useUser();
  const router = useRouter();

  const onSend=()=>{
    if(!user){
      router.push('/sign-in')
      return ;
    }
    //otherwise Navigate to create trip planner web page
    router.push('/create-new-trip')
  }
  return (
    <div className='mt-24 flex items-center justify-center'>
      {/* content */}
      <div className='max-w-3xl w-full text-center space-y-6' >
        <h1 className='text-xl md:text-5xl font-bold'> Hey, I'm your personal <span className='text-primary'>Trip Planner</span></h1>
        <p className='text-lg'>Tell Me what you want ? I'll handle the rest: Flights, Hotels, trip planner - all in seconds</p>
        
        {/* Input Box */}
        <div className='border rounded-2xl p-4 relative'>
          <Textarea placeholder="Create a trip from delhi to london"
          className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'/>
          <Button size={'icon'} className='absolute bottom-6 right-6' onClick={()=> onSend()}>
            <Send className='h-4 w-4'/>
          </Button>
        </div>
        
        {/* Suggestion List */}
        <div className='flex gap-4 justify-center'>  
          {suggestions.map((suggestion,index)=>(
              <div key={index} onClick={onSend} className='flex items-center gap-2 border 
               rounded-full p-2 cursor-pointer hover:shadow-md'>
                  {suggestion.icon}
                  <h2 className='text-sm whitespace-nowrap'>{suggestion.title}</h2>
              </div>
         ))}
        </div>
        
        <h2 className='flex gap-2 items-center justify-center'>Not Sure Where To Start? <strong>See how it works</strong> <ArrowDown/></h2>
        
        {/* Video Section */}
        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MinftripProduct.jpg?p=facebook"
          thumbnailAlt="Hero Video"
        />
      </div>
    </div>
    
  )
}

export default HeroSection