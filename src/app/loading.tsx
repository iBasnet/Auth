
export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col space-y-4 items-center justify-center">
      <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white" role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
      </div>
      <p>Loading...</p>
    </main>
  )
}
