'use client'

import { TrashIcon } from '@heroicons/react/24/solid'
import React, { useCallback, useState } from "react";
import { deleteServer } from "@/server/actions";
import { useFormStatus } from "react-dom";

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

  // Close modal on successful submit by listening to form submission end
  const onFormSubmit = useCallback(() => {
    // Modal will close immediately after submit; the page will revalidate via server action
    setIsOpen(false)
  }, [])

  return (
    <>
      <button
        type="button"
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-2xl"
        aria-label="Delete server"
        onClick={openModal}
      >
        <TrashIcon className="h-4 w-4 text-red-500" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => { e.stopPropagation(); closeModal(); }}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">Do you really want to delete this server? This action cannot be undone.</p>

            <form action={deleteServer} onSubmit={onFormSubmit} className="flex justify-end space-x-3">
              <input type="hidden" name="serverId" value={serverId} />
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <SubmitDeleteButton />
            </form>
          </div>
        </div>
      )}
    </>
  )
}
