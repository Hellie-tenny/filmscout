import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center text-white'>
      <SearchX className='w-14 h-14 text-slate-600 mb-4' />
      <h1 className='text-3xl font-extrabold mb-2'>Page Not Found</h1>
      <p className='text-slate-400 text-sm max-w-sm mb-8'>
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to='/'
        className='rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-green-400'
      >
        Back to Home
      </Link>
    </div>
  )
}