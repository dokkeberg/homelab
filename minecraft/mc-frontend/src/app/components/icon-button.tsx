"use client"

type IconButtonProps = {
    children: React.ReactNode,
    label: string,
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function IconButton({ children, label, onClick }: IconButtonProps) {
    return (
        <button
            type="button"
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-300 transition text-2xl"
            aria-label={label}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
