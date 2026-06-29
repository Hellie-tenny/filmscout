import { useState } from 'react'
import useDiscoverMovies from '../hooks/useDiscoverMovies'
import MediaModal from '../components/MediaModal'
import type { MediaItem, MediaType } from '../types/media'

const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
]

const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
]

export default function Discover() {
  const [activeTab, setActiveTab] = useState<MediaType>('movie')
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([])
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  const genres = activeTab === 'movie' ? MOVIE_GENRES : TV_GENRES
  const genreMap: Record<number, string> = Object.fromEntries(genres.map((g) => [g.id, g.name]))

  const { movies, loading, error } = useDiscoverMovies(selectedGenreIds, activeTab)

  const toggleGenre = (genreId: number) => {
    setSelectedGenreIds((current) =>
      current.includes(genreId)
        ? current.filter((item) => item !== genreId)
        : [...current, genreId]
    )
  }

  const toggleLike = (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation() // prevent card click from firing
    setLikedIds((current) => {
      const next = new Set(current)
      next.has(movieId) ? next.delete(movieId) : next.add(movieId)
      return next
    })
  }

  const releaseYear = (date: string) => date?.slice(0, 4) ?? '—'

  const handleTabSwitch = (tab: MediaType) => {
    setActiveTab(tab)
    setSelectedGenreIds([])
  }

  return (
    <div className='px-4 py-8 text-white sm:px-6 lg:px-8'>
      <h1 className='text-2xl font-bold mb-3 sm:text-3xl'>Discover</h1>
      <p className='text-slate-300 max-w-2xl mb-6'>
        Choose the genres you&apos;re interested in to find your next watch.
      </p>

      {/* tab switcher */}
      <div className='flex gap-2 mb-6'>
        {(['movie', 'tv'] as MediaType[]).map((tab) => (
          <button
            key={tab}
            type='button'
            onClick={() => handleTabSwitch(tab)}
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

      {/* genre pills */}
      <div className='flex flex-wrap gap-2'>
        {genres.map((genre) => {
          const isSelected = selectedGenreIds.includes(genre.id)
          return (
            <button
              key={genre.id}
              type='button'
              onClick={() => toggleGenre(genre.id)}
              className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                isSelected
                  ? 'border-green-500 bg-green-500 text-slate-950'
                  : 'border-slate-700 bg-slate-900/70 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              {genre.name}
            </button>
          )
        })}
      </div>

      {selectedGenreIds.length > 0 && (
        <p className='mt-4 text-sm text-slate-400'>
          {selectedGenreIds.length} genre{selectedGenreIds.length === 1 ? '' : 's'} selected
        </p>
      )}

      <div className='mt-6'>
        {error && <div className='py-4 text-center text-rose-400'>Error: {error}</div>}

        {!error && selectedGenreIds.length === 0 && (
          <div className='mt-10 flex flex-col items-center text-center text-slate-500'>
            <span className='text-4xl mb-3'>🎬</span>
            <p className='text-sm'>Pick a genre above to get started.</p>
          </div>
        )}

        {loading ? (
          <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='rounded-lg bg-slate-900/50 p-3 animate-pulse'>
                <div className='h-64 w-full rounded-md bg-slate-800' />
                <div className='mt-3 flex items-center justify-between'>
                  <div className='w-3/4'>
                    <div className='h-4 w-2/3 rounded bg-slate-700' />
                    <div className='mt-2 h-3 w-1/3 rounded bg-slate-700' />
                  </div>
                  <div className='ml-3 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200'>--</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && movies.length > 0 && (
            <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {movies.map((movie: MediaItem & { score: number }) => {
                const isLiked = likedIds.has(movie.id)
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
                      <div className='absolute top-2 right-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-950'>
                        {movie.score.toFixed(1)}
                      </div>
                    </div>

                    <div className='mt-3 flex flex-col gap-1 flex-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <h3 className='text-sm font-semibold leading-snug'>{movie.title}</h3>
                        <span className='shrink-0 text-xs text-slate-400'>{releaseYear(movie.release_date)}</span>
                      </div>

                      <div className='flex flex-wrap gap-1 mt-1'>
                        {movie.genre_ids.slice(0, 3).map((gid) => (
                          <span key={gid} className='rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300'>
                            {genreMap[gid] ?? 'Unknown'}
                          </span>
                        ))}
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
                        onClick={(e) => toggleLike(e, movie.id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          isLiked
                            ? 'bg-green-500 text-slate-950'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {isLiked ? '♥ Liked' : '♡ Like'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}
      </div>

      {/* modal */}
      {selectedItem && (
        <MediaModal
          item={selectedItem}
          mediaType={activeTab}
          genreMap={genreMap}
          onClose={() => setSelectedItem(null)}
          onSelect={(item) => setSelectedItem(item)}
        />
      )}
    </div>
  )
}