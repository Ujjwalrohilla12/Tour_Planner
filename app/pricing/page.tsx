import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const isBillingEnabled = process.env.NEXT_PUBLIC_CLERK_BILLING_ENABLED === 'true'

export default function Pricing() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            {isBillingEnabled ? (
                <PricingTable />
            ) : (
                <div style={{ padding: '2rem', background: '#fffbf0', border: '1px solid #f5c150', borderRadius: 8 }}>
                    <h2 style={{ margin: 0, color: '#994e00' }}>Billing is disabled</h2>
                    <p style={{ margin: '0.5rem 0 0' }}>
                        Clerk billing is not configured in this environment. To enable, visit the Clerk dashboard at:
                        <br />
                        <a href="https://dashboard.clerk.com/last-active?path=billing/settings" target="_blank" rel="noreferrer">
                            https://dashboard.clerk.com/last-active?path=billing/settings
                        </a>
                    </p>
                </div>
            )}
        </div>
    )
}