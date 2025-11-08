"use client"

import { useFormStatus } from "react-dom"
import styles from "./loading.module.css"

type Props = {
  children?: React.ReactNode
  className?: string
  idleText?: string
  pendingText?: string
}

export default function SubmitButton({
  children,
  className,
  idleText = "Create server",
  pendingText = "Creating...",
}: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className={className ?? "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"}
      disabled={pending}
      aria-busy={pending}
    >
      {pending && <span className={styles.spinner} aria-hidden="true" />}
      <span>{pending ? pendingText : (children ?? idleText)}</span>
    </button>
  )
}
