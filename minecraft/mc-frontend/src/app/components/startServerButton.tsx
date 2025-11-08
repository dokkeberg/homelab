'use client'

import { RocketLaunchIcon } from '@heroicons/react/24/solid'

export default function StartServerButton() {

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        console.log('Start server')
    }

    return (
        <button
            type="button"
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-2xl"
            aria-label="Stop server"
            onClick={handleClick}
        >
            <RocketLaunchIcon className="h-4 w-4 text-green-500" />
        </button>
    )
}
