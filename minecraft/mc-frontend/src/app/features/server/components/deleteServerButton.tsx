'use client'

import { TrashIcon } from '@heroicons/react/24/solid'
import React, { useCallback, useState } from "react";
import { deleteServer } from "@/features/server/actions/deleteServer";
import { useFormStatus } from "react-dom";
import IconButton from '@/app/components/icon-button';

function SubmitDeleteButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
      disabled={pending}
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

export default function DeleteServerButton({ serverId }: { serverId: number }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsOpen(true)
  }, [])

  const closeModal = useCallback((event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault()
    setIsOpen(false)
  }, [])

  const onFormSubmit = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <div>
      <IconButton label="Delete server" onClick={openModal}>
        <TrashIcon className="h-4 w-4 text-red-500" />
      </IconButton>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={(e) => { e.stopPropagation(); closeModal(); }}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Are you sure?</h2>
            <p className="mb-6 text-gray-700">Do you really want to delete this server? This action cannot be undone.</p>

            <form action={deleteServer} onSubmit={onFormSubmit} className="flex justify-end space-x-3">
              <input type="hidden" name="serverId" value={serverId} />
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <SubmitDeleteButton />
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
