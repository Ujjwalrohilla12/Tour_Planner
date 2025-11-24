import React from 'react'
import { Globe2 } from 'lucide-react'

const suggestions=[
  {
    title:'Create New Trip',
    icon:<Globe2 className='text-blue-400 h-5 w-5'/>
  },
  {
    title:'Inspire me where to go',
    icon:<Globe2 className='text-green-500 h-5 w-5'/>
  },
  {
    title:'Discover Hidden gems',
    icon:<Globe2 className='text-orange-500 h-5 w-5'/>
  },
  {
    title:'Adventure Destinations',
    icon:<Globe2 className='text-yellow-600 h-5 w-5'/>
  }
]

interface EmptyBoxStateProps {
  onSelectoption?: (title: string) => void;
}

function EmptyBoxState({onSelectoption}: EmptyBoxStateProps) {
  return (
    <div className='mt-7'>
        <h2 className='font-bold text-4xl text-center'>Start Planning new <strong className='text-primary'>Trip</strong> using AI</h2>
        <p className='text-center text-gray-600 mt-4'>Discover personalized travel itineraries, find the best destinations, and plan your dream vacation effortlessly with the power of AI. Let our smart assistant do the hard work while you enjoy the journey.</p>
    
        <div className='flex flex-col gap-5 mt-7 items-center'>  
          {suggestions.map((suggestion,index)=>(
            <div key={index} 
            onClick={()=>onSelectoption?.(suggestion.title)}
            className='flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:border-primary text-primary'>
              {suggestion.icon}
              <h2 className='text-lg whitespace-nowrap'>{suggestion.title}</h2>
            </div>
          ))}
        </div>
    </div>
  )
}

export default EmptyBoxState