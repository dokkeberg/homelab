'use client'

import IconButton from '@/app/components/icon-button'
import { RocketLaunchIcon } from '@heroicons/react/24/solid'

export default function StartServerButton() {

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        console.log('Start server')
    }

    return (
        <IconButton onClick={handleClick} label="Start server">
            <RocketLaunchIcon className="h-4 w-4 text-green-500" />
        </IconButton>
    )
}
