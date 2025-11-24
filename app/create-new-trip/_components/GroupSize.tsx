import React from 'react'

export const SelectTravelesList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A sole traveler in exploration',
    icon: '🧍‍♂',
    people: '1',
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '👫',
    people: '2 People',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun loving adventurers',
    icon: '🏡',
    people: '3 to 5 People',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: '⛺',
    people: '5 to 10 People',
    color: 'bg-purple-100 text-purple-600',
  },
];


interface GroupSizeProps {
  onSelectedOption?: (value: string) => void;
}

function GroupSize({ onSelectedOption }: GroupSizeProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 items-center mt-1'>
      {SelectTravelesList.map((item,index)=>(
        <div key={index} 
             className={`border p-4 rounded-lg mb-2 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-100 ${item.color}`}
             onClick={()=>onSelectedOption?.(item.title+" - "+item.people)}>
            <h2 className='text-2xl'>{item.icon}</h2>
            <h2 className='font-semibold'>{item.title}</h2>
            <p className='text-sm text-center'>{item.desc}</p>
            <span className='text-xs font-medium'>{item.people}</span>
        </div>
        ))}
    </div>
  )
}

export default GroupSize