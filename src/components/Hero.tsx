import heroImage from '../assets/imgs/hero.jpg'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className='relative w-full h-72 sm:h-96 lg:h-[480px] overflow-hidden'>
      <img
        className='h-full w-full object-cover object-center scale-105'
        src={heroImage}
        alt='hero'
      />

      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />

      <div className='absolute inset-0 flex flex-col items-center justify-center px-4 text-center'>
        <p className='text-xs font-semibold uppercase tracking-widest text-green-400 mb-3'>
          Your personal movie guide
        </p>
        <h1 className='text-3xl sm:text-5xl font-extrabold text-white leading-tight max-w-xl'>
          Find Your Next{' '}
          <span className='text-green-400'>Favourite Watch.</span>
        </h1>
        <p className='mt-3 text-sm sm:text-base text-white/70 max-w-md'>
          Discover top-rated movies and shows streaming right now, picked based on what you love.
        </p>
        <div className='mt-6 flex gap-3'>
          <Link
            to='/discover'
            className='rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-400 active:scale-95'
          >
            Start Discovering
          </Link>
          <Link
            to='/new-releases'
            className='rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95'
          >
            What's New
          </Link>
        </div>
      </div>

      <div className='absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-800 to-transparent' />
    </div>
  )
}