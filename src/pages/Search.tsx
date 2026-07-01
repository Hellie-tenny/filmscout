import { useState } from 'react'
import useSearch from '../hooks/useSearch'
import useWatchlist from '../hooks/useWatchlist'
import MediaModal from '../components/MediaModal'
import type { MediaItem } from '../types/media'
import useDisliked from '../hooks/useDisliked'
import { Search as SearchIcon, SearchX } from 'lucide-react'

const MOVIE_GENRES = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' }, { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
]

const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' }, { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' }, { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' }, { id: 10762, name: 'Kids' }, { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' }, { id: 10764, name: 'Reality' }, { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' }, { id: 10767, name: 'Talk' }, { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
]

const GENRE_MAP: Record<number, string> = Object.fromEntries(
  [...MOVIE_GENRES, ...TV_GENRES].map((g) => [g.id, g.name])
)

export default function Search() {
  const [query, setQuery] = useState('')
  const { results, loading, error } = useSearch(query)
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const { isDisliked, toggleDisliked } = useDisliked()

  const releaseYear = (date: string) => date?.slice(0, 4) ?? '—'

  const toggleLike = (e: React.MouseEvent, movie: MediaItem) => {
    e.stopPropagation()
    toggleWatchlist(movie)
  }

  return (
    <div className='px-4 py-8 text-white sm:px-6 lg:px-8'>
      <h1 className='text-2xl font-bold mb-3 sm:text-3xl'>Search</h1>
      <p className='text-slate-300 max-w-2xl mb-6'>
        Look up a movie or show you already have in mind.
      </p>

      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search movies and TV shows...'
        autoFocus
        className='w-full rounded-full border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-green-500 transition-colors'
      />

      <div className='mt-6'>
        {error && <div className='py-4 text-center text-rose-400'>Error: {error}</div>}

        {query.trim().length === 0 && !error && (
          <div className='mt-10 flex flex-col items-center text-center text-slate-500'>
            <SearchIcon className='w-10 h-10 text-slate-600 mb-3' />
            <p className='text-sm'>Start typing to search.</p>
          </div>
        )}

        {loading && (
          <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='rounded-lg bg-slate-900/50 p-3 animate-pulse'>
                <div className='h-64 w-full rounded-md bg-slate-800' />
                <div className='mt-3 h-4 w-2/3 rounded bg-slate-700' />
                <div className='mt-2 h-3 w-1/3 rounded bg-slate-700' />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && query.trim().length > 0 && results.length === 0 && (
          <div className='mt-10 flex flex-col items-center text-center text-slate-500'>
            <SearchX className='w-10 h-10 text-slate-600 mb-3' />
            <p className='text-sm'>No results found for &quot;{query}&quot;.</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {results.map((movie) => {
              const isLiked = isInWatchlist(movie.id)
              return (
                <div
                  key={movie.id}
                  className='flex flex-col rounded-lg bg-slate-900/50 p-3 cursor-pointer hover:bg-slate-800/70 transition-colors'
                  onClick={() => setSelectedItem(movie)}
                >
                  <div className='relative'>
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className='w-full rounded-md object-cover'
                      />
                    ) : (
                      <div className='flex h-64 items-center justify-center rounded-md bg-slate-800 text-slate-400'>
                        No image
                      </div>
                    )}
                    <div className='absolute top-2 right-2 rounded-full bg-slate-700/90 px-2 py-0.5 text-xs font-medium text-slate-200'>
                      {movie.media_type === 'movie' ? 'Movie' : 'TV'}
                    </div>
                  </div>

                  <div className='mt-3 flex flex-col gap-1 flex-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <h3 className='text-sm font-semibold leading-snug'>{movie.title}</h3>
                      <span className='shrink-0 text-xs text-slate-400'>{releaseYear(movie.release_date)}</span>
                    </div>

                    {movie.overview && (
                      <p className='mt-1 text-xs text-slate-400 line-clamp-3 leading-relaxed'>
                        {movie.overview}
                      </p>
                    )}
                  </div>

                  <div className='mt-3 flex items-center justify-between'>
                    <span className='text-xs text-slate-400'>⭐ {movie.vote_average.toFixed(1)}</span>
                    <button
                      type='button'
                      onClick={(e) => toggleLike(e, movie)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${isLiked
                          ? 'bg-green-500 text-slate-950'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                    >
                      {isLiked ? '✓ Added' : '+ Watchlist'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedItem && (
        <MediaModal
          item={selectedItem}
          mediaType={selectedItem.media_type} // or activeTab for Discover/NewReleases
          genreMap={genreMap} // or GENRE_MAP for Search/Watchlist
          onClose={() => setSelectedItem(null)}
          onSelect={(item) => setSelectedItem(item)}
          isInWatchlist={isInWatchlist(selectedItem.id)}
          onToggleWatchlist={() => toggleWatchlist(selectedItem)}
          isDisliked={isDisliked(selectedItem.id)}
          onToggleDisliked={() => toggleDisliked(selectedItem)}
        />
      )}
    </div>
  )
}