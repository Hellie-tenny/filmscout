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
        <nav className='flex gap-4 text-sm sm:text-base'>
          <NavLink to='/' end className={linkClass}>Home</NavLink>
          <NavLink to='/discover' className={linkClass}>Discover</NavLink>
          <NavLink to='/new-releases' className={linkClass}>New Releases</NavLink>
        </nav>
      </header>
    </div>
  )
}