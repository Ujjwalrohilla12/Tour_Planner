"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Toast } from '@/components/ui/toast'
import { Mail, MapPin, Phone, Send } from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface ToastState {
  show: boolean
  title: string
  description: string
  variant: 'default' | 'destructive'
}

export default function ContactUs() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    description: '',
    variant: 'default'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }))
  }

  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    setToast({ show: true, title, description, variant })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Error', 'Please fill in all fields', 'destructive')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        showToast('Success!', result.message)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        showToast('Error', result.error, 'destructive')
      }
    } catch (error) {
      showToast('Error', 'Failed to send message. Please try again.', 'destructive')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>Contact Us</h1>
          <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            We'd love to hear from you! Send us a message and we'll respond ASAP.
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-12'>
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8'>
            <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-white'>Send us a message</h2>
            
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Full Name
                </label>
                <Input
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Your full name'
                  disabled={isLoading}
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Email Address
                </label>
                <Input
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='your.email@example.com'
                  disabled={isLoading}
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Subject
                </label>
                <Input
                  name='subject'
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder='What is this about?'
                  disabled={isLoading}
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Message
                </label>
                <Textarea
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder='Tell us more about your inquiry...'
                  disabled={isLoading}
                  className='w-full min-h-32'
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium transition-all duration-200 hover:scale-[1.02]'
              >
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Sending...
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Send className='w-4 h-4' />
                    Send Message
                  </div>
                )}
              </Button>
            </form>
          </div>

          <div className='space-y-8'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8'>
              <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-white'>Get in touch</h2>
              
              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <div className='bg-blue-100 dark:bg-blue-900 p-3 rounded-lg'>
                    <Mail className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>Email</h3>
                    <p className='text-gray-600 dark:text-gray-300'>support@aitripplanner.com</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='bg-green-100 dark:bg-green-900 p-3 rounded-lg'>
                    <MapPin className='w-6 h-6 text-green-600 dark:text-green-400' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>Location</h3>
                    <p className='text-gray-600 dark:text-gray-300'>New Delhi, India</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Available worldwide</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='bg-purple-100 dark:bg-purple-900 p-3 rounded-lg'>
                    <Phone className='w-6 h-6 text-purple-600 dark:text-purple-400' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>Support</h3>
                    <p className='text-gray-600 dark:text-gray-300'>24/7 Online Support</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Always here to help</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white'>
              <h3 className='text-xl font-semibold mb-4'>Why choose AI Trip Planner?</h3>
              <ul className='space-y-3 text-sm'>
                <li className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-white rounded-full' />
                  AI-powered personalized itineraries
                </li>
                <li className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-white rounded-full' />
                  Real-time travel recommendations
                </li>
                <li className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-white rounded-full' />
                  24/7 customer support
                </li>
                <li className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-white rounded-full' />
                  Seamless booking experience
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={hideToast}
        />
      )}
    </div>
  )
}