'use client'

import IconButton from '@/app/components/icon-button'
import { StopCircleIcon } from '@heroicons/react/24/solid'

export default function StopServerButton() {

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        console.log('Stop server')
    }

    return (
        <IconButton onClick={handleClick} label="Stop server">
            <StopCircleIcon className="h-4 w-4 text-red-500" />
        </IconButton>
    )
}
