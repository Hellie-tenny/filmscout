import { useState } from 'react'
import Hero from './Hero'
import Featured from './Featured'
import useLanding from '../hooks/useLanding'
import type { MediaType } from '../types/media'

export default function Landing() {
  const { featuredMovies, featuredShows, movieGenres, tvGenres, loading, error } = useLanding()
  const [activeTab, setActiveTab] = useState<MediaType>('movie')

  const movies = activeTab === 'movie' ? featuredMovies : featuredShows
  const genres = activeTab === 'movie' ? movieGenres : tvGenres

  return (
    <div className='py-5'>
      <Hero />

      {/* tab switcher */}
      <div className='px-4 sm:px-6 lg:px-8 mt-6 flex gap-2'>
        {(['movie', 'tv'] as MediaType[]).map((tab) => (
          <button
            key={tab}
            type='button'
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-green-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab === 'movie' ? 'Movies' : 'TV Shows'}
          </button>
        ))}
      </div>

      <Featured
        movies={movies}
        genresList={genres}
        loading={loading}
        error={error}
      />
    </div>
  )
}