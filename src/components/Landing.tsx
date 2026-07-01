import { useState } from 'react'
import { Link } from 'react-router-dom'
import Hero from './Hero'
import Featured from './Featured'
import useLanding from '../hooks/useLanding'
import type { MediaType } from '../types/media'
import { Clapperboard, Sparkles, Bookmark } from 'lucide-react'
import type { ReactNode } from 'react'

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Pick Your Genres',
    description: 'Choose the kinds of movies or shows you are in the mood for — action, drama, comedy, and more.',
    icon: <Clapperboard className='w-7 h-7 text-green-400' />,
    link: '/discover',
    cta: 'Go to Discover',
  },
  {
    step: '02',
    title: 'Browse Top Picks',
    description: 'See top-rated titles streaming right now, ranked based on your taste and genre preferences.',
    icon: <Sparkles className='w-7 h-7 text-green-400' />,
    link: '/new-releases',
    cta: 'See New Releases',
  },
  {
    step: '03',
    title: 'Save What Excites You',
    description: 'Add anything that catches your eye to your watchlist and come back to it anytime.',
    icon: <Bookmark className='w-7 h-7 text-green-400' />,
    link: '/watchlist',
    cta: 'My Watchlist',
  },
]

export default function Landing() {
  const { featuredMovies, featuredShows, movieGenres, tvGenres, loading, error } = useLanding()
  const [activeTab, setActiveTab] = useState<MediaType>('movie')

  const movies = activeTab === 'movie' ? featuredMovies : featuredShows
  const genres = activeTab === 'movie' ? movieGenres : tvGenres

  return (
    <div className='py-5'>
      <Hero />

      {/* how it works */}
      <section className='px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-10'>
          <p className='text-xs font-semibold uppercase tracking-widest text-green-400 mb-2'>
            How it works
          </p>
          <h2 className='text-2xl sm:text-3xl font-bold text-white'>
            Your next watch is three steps away
          </h2>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className='relative flex flex-col rounded-xl bg-slate-900/60 p-6 border border-slate-700/50'
            >
              {/* step number */}
              <span className='absolute top-4 right-4 text-xs font-bold text-slate-600'>
                {item.step}
              </span>

              <span className='text-3xl mb-4'>{item.icon}</span>
              <h3 className='text-base font-bold text-white mb-2'>{item.title}</h3>
              <p className='text-sm text-slate-400 leading-relaxed flex-1'>
                {item.description}
              </p>
              <Link
                to={item.link}
                className='mt-5 self-start rounded-full bg-slate-700 px-4 py-1.5 text-xs font-medium text-slate-300 hover:bg-green-500 hover:text-slate-950 transition-colors'
              >
                {item.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* now streaming section */}
      <section className='px-4 sm:px-6 lg:px-8 pb-4'>
        <div className='flex items-center justify-between mb-2'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-widest text-green-400 mb-1'>
              Now Streaming
            </p>
            <h2 className='text-xl sm:text-2xl font-bold text-white'>
              What's hot right now
            </h2>
          </div>

          {/* tab switcher */}
          <div className='flex gap-2'>
            {(['movie', 'tv'] as MediaType[]).map((tab) => (
              <button
                key={tab}
                type='button'
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-green-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab === 'movie' ? 'Movies' : 'TV Shows'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Featured
        movies={movies}
        genresList={genres}
        loading={loading}
        error={error}
      />

      {/* bottom CTA */}
      <section className='px-4 sm:px-6 lg:px-8 py-14'>
        <div className='rounded-2xl bg-slate-900/60 border border-slate-700/50 px-6 py-10 text-center'>
          <h2 className='text-2xl sm:text-3xl font-bold text-white mb-3'>
            Ready to find something great?
          </h2>
          <p className='text-slate-400 text-sm max-w-md mx-auto mb-6'>
            Browse by genre, check what's new on streaming, or search for something specific.
          </p>
          <div className='flex flex-wrap gap-3 justify-center'>
            <Link
              to='/discover'
              className='rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-green-400'
            >
              Discover Movies
            </Link>
            <Link
              to='/new-releases'
              className='rounded-full bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-600'
            >
              New Releases
            </Link>
            <Link
              to='/search'
              className='rounded-full bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-600'
            >
              Search
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}