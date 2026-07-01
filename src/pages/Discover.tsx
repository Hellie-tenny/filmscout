import { useMemo, useState, useEffect } from 'react'
import useDiscoverMovies from '../hooks/useDiscoverMovies'
import MediaModal from '../components/MediaModal'
import type { MediaItem, MediaType } from '../types/media'
import useWatchlist from '../hooks/useWatchlist'
import useDisliked from '../hooks/useDisliked'
import { Film, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'

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

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1939 }, (_, i) => CURRENT_YEAR - i)

const PERIOD_PRESETS = [
  { label: 'This year', from: CURRENT_YEAR, to: CURRENT_YEAR },
  { label: 'Last 5 years', from: CURRENT_YEAR - 5, to: CURRENT_YEAR },
  { label: '2010s', from: 2010, to: 2019 },
  { label: '2000s', from: 2000, to: 2009 },
  { label: '90s', from: 1990, to: 1999 },
  { label: '80s', from: 1980, to: 1989 },
  { label: 'Classic', from: 1900, to: 1979 },
]

type Filters = {
  yearFrom: number | null
  yearTo: number | null
  adultContent: boolean
}

const DEFAULT_FILTERS: Filters = {
  yearFrom: null,
  yearTo: null,
  adultContent: false,
}

export default function Discover() {
  const [activeTab, setActiveTab] = useState<MediaType>(() => {
    return (localStorage.getItem('discover_tab') as MediaType) ?? 'movie'
  })
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('discover_genres')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  useEffect(() => {
    localStorage.setItem('discover_tab', activeTab)
    localStorage.setItem('discover_genres', JSON.stringify(selectedGenreIds))
  }, [activeTab, selectedGenreIds])

  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const { isDisliked, toggleDisliked, disliked } = useDisliked()

  const genres = activeTab === 'movie' ? MOVIE_GENRES : TV_GENRES
  const genreMap: Record<number, string> = Object.fromEntries(
    genres.map((g) => [g.id, g.name])
  )

  const ratedMovies = useMemo(
    () => disliked.map((m) => ({ movie: m, rating: 1 })),
    [disliked]
  )

  const { movies, loading, error } = useDiscoverMovies(
    selectedGenreIds,
    activeTab,
    ratedMovies,
    undefined,
    filters
  )

  // count active filters for the badge
  const activeFilterCount = [
    filters.yearFrom !== null,
    filters.yearTo !== null,
    filters.adultContent,
  ].filter(Boolean).length

  const toggleGenre = (genreId: number) => {
    setSelectedGenreIds((current) =>
      current.includes(genreId)
        ? current.filter((item) => item !== genreId)
        : [...current, genreId]
    )
  }

  const toggleLike = (e: React.MouseEvent, movie: MediaItem) => {
    e.stopPropagation()
    toggleWatchlist(movie)
  }

  const releaseYear = (date: string) => date?.slice(0, 4) ?? '—'

  const handleTabSwitch = (tab: MediaType) => {
    setActiveTab(tab)
    setSelectedGenreIds([])
    setFilters(DEFAULT_FILTERS)
  }

  const applyPreset = (from: number, to: number) => {
    setFilters((f) => ({ ...f, yearFrom: from, yearTo: to }))
  }

  const clearFilters = () => setFilters(DEFAULT_FILTERS)

  const isPresetActive = (from: number, to: number) =>
    filters.yearFrom === from && filters.yearTo === to

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

      {/* filters toggle button */}
      <div className='mt-5 flex items-center gap-3'>
        <button
          type='button'
          onClick={() => setFiltersOpen((o) => !o)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            filtersOpen || activeFilterCount > 0
              ? 'border-green-500 bg-green-500/10 text-green-400'
              : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className='w-4 h-4' />
          Filters
          {activeFilterCount > 0 && (
            <span className='rounded-full bg-green-500 text-slate-950 text-xs font-bold px-1.5 py-0.5 leading-none'>
              {activeFilterCount}
            </span>
          )}
          {filtersOpen
            ? <ChevronUp className='w-4 h-4' />
            : <ChevronDown className='w-4 h-4' />
          }
        </button>

        {activeFilterCount > 0 && (
          <button
            type='button'
            onClick={clearFilters}
            className='flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors'
          >
            <X className='w-3 h-3' />
            Clear filters
          </button>
        )}
      </div>

      {/* collapsible filters panel */}
      {filtersOpen && (
        <div className='mt-3 rounded-xl border border-slate-700/50 bg-slate-900/60 p-5 flex flex-col gap-6'>

          {/* period presets */}
          <div>
            <p className='text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3'>
              Period
            </p>
            <div className='flex flex-wrap gap-2'>
              {PERIOD_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type='button'
                  onClick={() => applyPreset(preset.from, preset.to)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isPresetActive(preset.from, preset.to)
                      ? 'border-green-500 bg-green-500 text-slate-950'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* custom year range */}
          <div>
            <p className='text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3'>
              Custom Year Range
            </p>
            <div className='flex items-center gap-3'>
              <select
                value={filters.yearFrom ?? ''}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    yearFrom: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className='rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-green-500 transition-colors'
              >
                <option value=''>From</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <span className='text-slate-500 text-sm'>to</span>

              <select
                value={filters.yearTo ?? ''}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    yearTo: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className='rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-green-500 transition-colors'
              >
                <option value=''>To</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* adult content toggle */}
          <div>
            <p className='text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3'>
              Content
            </p>
            <button
              type='button'
              onClick={() => setFilters((f) => ({ ...f, adultContent: !f.adultContent }))}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors w-full sm:w-auto ${
                filters.adultContent
                  ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div
                className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                  filters.adultContent ? 'bg-rose-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    filters.adultContent ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <div className='text-left'>
                <p className='text-sm font-medium'>
                  {filters.adultContent ? 'Adult content on' : 'Adult content off'}
                </p>
                <p className='text-xs text-slate-500'>
                  {filters.adultContent
                    ? 'Showing 18+ titles in results'
                    : 'Only showing family-safe results'}
                </p>
              </div>
            </button>
          </div>

        </div>
      )}

      <div className='mt-6'>
        {error && <div className='py-4 text-center text-rose-400'>Error: {error}</div>}

        {!error && selectedGenreIds.length === 0 && (
          <div className='mt-10 flex flex-col items-center text-center text-slate-500'>
            <Film className='w-10 h-10 text-slate-600 mb-3' />
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
                  <div className='ml-3 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200'>
                    --
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && movies.length > 0 && (
            <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {movies.map((movie: MediaItem & { score: number }) => {
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
                      <div className='absolute top-2 right-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-950'>
                        {movie.score.toFixed(1)}
                      </div>
                    </div>

                    <div className='mt-3 flex flex-col gap-1 flex-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <h3 className='text-sm font-semibold leading-snug'>{movie.title}</h3>
                        <span className='shrink-0 text-xs text-slate-400'>
                          {releaseYear(movie.release_date)}
                        </span>
                      </div>

                      <div className='flex flex-wrap gap-1 mt-1'>
                        {movie.genre_ids.slice(0, 3).map((gid) => (
                          <span
                            key={gid}
                            className='rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300'
                          >
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
                      <span className='text-xs text-slate-400'>
                        ⭐ {movie.vote_average.toFixed(1)}
                      </span>
                      <button
                        type='button'
                        onClick={(e) => toggleLike(e, movie)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          isLiked
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
          )
        )}
      </div>

      {/* modal */}
      {selectedItem && (
        <MediaModal
          item={selectedItem}
          mediaType={selectedItem.media_type}
          genreMap={genreMap}
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