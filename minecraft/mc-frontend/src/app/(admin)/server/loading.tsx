

export default function Loading() {

    return (
        <>
            <div className="mb-4 min-h-12 flex items-center justify-between">
                <div className="flex animate-pulse w-full h-8 rounded-sm bg-gray-400" />
            </div>
            <div className="flex flex-wrap gap-6">
                {[1, 2, 3].map((placeholder) => (
                    <div key={placeholder} className="relative h-64 w-64 bg-gray-400 rounded-lg overflow-hidden shadow-md group" />
                ))}
            </div>
        </>        
    )
}