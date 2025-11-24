'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

const menuOptions = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'My Tour',
        path: '/my-tour'
    },
    {
        name: 'Pricing',
        path: '/pricing'
    },
    {
        name: 'Contact Us',
        path: '/contact-us'
    }
]

function Header() {
    const { user, isLoaded } = useUser()
    const [isMounted, setIsMounted] = useState(false)
    const path=usePathname();
    console.log(path)


    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <div className='flex justify-between items-center p-4 '>
            {/* logo */}
            <div className='flex gap-2 items-center'>
                <Image src={'/logo.svg'} alt='logo' width={30} height={30} />
                <h2 className='font-bold text-2xl'>AI Tour Planner</h2>
            </div>

            {/* menu options */}
            <div className='flex gap-8 items-center'>
                {menuOptions.map((menu, index) => (
                    <Link key={index} href={menu.path} className='no-underline'>
                        <h2 className='text-lg cursor-pointer'>{menu.name}</h2>
                    </Link>
                ))}
            </div>

            {/* Auth Button */}
            <div className='flex gap-2 items-center'>
            {!isMounted || !isLoaded ? (
                <div className=' flex gap-5 items-center'></div>
            ) : !user ? (
                <SignInButton mode='modal'>
                    <Button>Get Started</Button>
                </SignInButton>
            ) : (
                <>
                    <Link href='/create-new-trip'>
                        <Button>Create New Tour</Button>
                    </Link>
                    <UserButton />
                </>
            )}
            </div>
        </div>
    )
}

export default Header