'use client'

import { StopCircleIcon } from '@heroicons/react/24/solid'
import React from "react";

export default function StopServerButton() {

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        console.log('Stop server')
    }

    return (
        <button
            type="button"
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-2xl"
            aria-label="Stop server"
            onClick={handleClick}
        >
            <StopCircleIcon className="h-4 w-4 text-red-500" />
        </button>
    )
}
