"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestContact() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testContactAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Message',
          message: 'This is a test message to verify the contact form API is working correctly.'
        })
      })
      
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-6'>Contact API Test</h1>
      
      <div className='space-y-4'>
        <Button 
          onClick={testContactAPI} 
          disabled={loading}
          className='w-full'
        >
          {loading ? 'Testing...' : 'Test Contact API'}
        </Button>
        
        {result && (
          <div className='bg-gray-100 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2'>Result:</h3>
            <pre className='text-sm overflow-auto'>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h3 className='font-semibold mb-2'>Test Details:</h3>
          <ul className='text-sm space-y-1'>
            <li>• Tests POST /api/contact endpoint</li>
            <li>• Validates form data processing</li>
            <li>• Checks email service integration</li>
            <li>• Verifies error handling</li>
          </ul>
        </div>
      </div>
    </div>
  )
}