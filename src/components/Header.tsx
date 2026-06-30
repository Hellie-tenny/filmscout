import { NavLink } from 'react-router-dom'

export default function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-green-400 font-semibold'
      : 'text-white hover:text-green-400 transition-colors'

  return (
    <div className='px-4 py-5 sm:px-6 lg:px-8'>
      <header className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4'>
        <NavLink to='/' className='text-lg font-bold text-green-500'>FilmScout</NavLink>
        <nav className='flex items-center gap-4 text-sm sm:text-base'>
          <NavLink to='/' end className={linkClass}>Home</NavLink>
          <NavLink to='/discover' className={linkClass}>Discover</NavLink>
          <NavLink to='/new-releases' className={linkClass}>New Releases</NavLink>
          <NavLink to='/watchlist' className={linkClass}>Watchlist</NavLink>
          <NavLink
            to='/search'
            className={({ isActive }) =>
              isActive ? 'text-green-400' : 'text-white hover:text-green-400 transition-colors'
            }
            aria-label='Search'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-5 h-5'
            >
              <circle cx='11' cy='11' r='8' />
              <line x1='21' y1='21' x2='16.65' y2='16.65' />
            </svg>
          </NavLink>
        </nav>
      </header>
    </div>
  )
}