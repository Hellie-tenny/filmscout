import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className='px-4 py-5 sm:px-6 lg:px-8'>
      <header className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4'>
        <Link to='/' className='text-lg font-bold text-green-500'>FilmScout</Link>
        <nav className='flex gap-4 text-white text-sm sm:text-base'>
          <Link to='/' className='hover:text-green-400'>Home</Link>
          <Link to='/discover' className='hover:text-green-400'>Discover</Link>
        </nav>
      </header>
    </div>
  )
}
