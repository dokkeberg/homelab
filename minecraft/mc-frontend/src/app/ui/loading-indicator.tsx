'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
    const { pending } = useLinkStatus()
    return pending ? (
        <div role="status" aria-label="Loading" className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
    ) : null
}