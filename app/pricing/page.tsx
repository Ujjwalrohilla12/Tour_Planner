import { PricingTable } from '@clerk/nextjs'
import React from 'react'

export default function Pricing() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            <PricingTable />
        </div>
    )
}