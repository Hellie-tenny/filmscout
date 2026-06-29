import type { MediaWithProviders } from '../hooks/useLanding'

type FeaturedProps = {
  movies: MediaWithProviders[]
  genresList: Record<number, string>
  loading: boolean
  error: string | null
}

function SkeletonHero() {
  return (
    <div className='w-full h-96 rounded-xl bg-slate-800 animate-pulse' />
  )
}

function SkeletonCard() {
  return (
    <div className='flex-shrink-0 w-40 sm:w-48 h-64 rounded-lg bg-slate-800 animate-pulse' />
  )
}

function HeroCard({ movie, genresList }: { movie: MovieWithProviders; genresList: Record<number, string> }) {
  return (
    <div className='relative w-full h-96 rounded-xl overflow-hidden'>
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          alt={movie.title}
          className='w-full h-full object-cover'
        />
      ) : (
        <div className='w-full h-full bg-slate-800 flex items-center justify-center text-slate-400'>
          No image
        </div>
      )}

      {/* gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />

      {/* content */}
      <div className='absolute bottom-0 left-0 right-0 p-5'>
        {/* streaming badges */}
        {movie.providers.length > 0 && (
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-xs text-green-400 font-medium'>Streaming on</span>
            {movie.providers.slice(0, 3).map((name) => (
              <img
                key={name}
                src={`https://image.tmdb.org/t/p/w45${movie.providerLogos[name]}`}
                alt={name}
                title={name}
                className='h-6 w-6 rounded'
              />
            ))}
          </div>
        )}

        <h2 className='text-white text-2xl font-bold leading-tight'>{movie.title}</h2>

        {/* meta row */}
        <div className='flex items-center gap-3 mt-1'>
          <span className='text-amber-400 text-sm font-semibold'>⭐ {movie.vote_average.toFixed(1)}</span>
          <span className='text-slate-400 text-sm'>{movie.release_date?.slice(0, 4)}</span>
          <div className='flex gap-1'>
            {(movie.genre_ids ?? []).slice(0, 2).map((gid) => (
              <span key={gid} className='text-xs text-slate-300 bg-slate-700/70 rounded-full px-2 py-0.5'>
                {genresList[gid] ?? 'Unknown'}
              </span>
            ))}
          </div>
        </div>

        {/* overview */}
        {movie.overview && (
          <p className='mt-2 text-sm text-slate-300 line-clamp-2'>{movie.overview}</p>
        )}
      </div>
    </div>
  )
}

function SmallCard({ movie, genresList }: { movie: MovieWithProviders; genresList: Record<number, string> }) {
  return (
    <div className='flex-shrink-0 w-40 sm:w-48 relative rounded-lg overflow-hidden h-64'>
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className='w-full h-full object-cover'
        />
      ) : (
        <div className='w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs'>
          No image
        </div>
      )}

      <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent' />

      <div className='absolute bottom-0 left-0 right-0 p-2'>
        {/* streaming logos */}
        {movie.providers.length > 0 && (
          <div className='flex gap-1 mb-1'>
            {movie.providers.slice(0, 2).map((name) => (
              <img
                key={name}
                src={`https://image.tmdb.org/t/p/w45${movie.providerLogos[name]}`}
                alt={name}
                title={name}
                className='h-5 w-5 rounded'
              />
            ))}
          </div>
        )}
        <p className='text-white text-xs font-semibold line-clamp-2 leading-snug'>{movie.title}</p>
        <div className='flex items-center gap-2 mt-0.5'>
          <span className='text-amber-400 text-xs'>⭐ {movie.vote_average.toFixed(1)}</span>
          <span className='text-slate-400 text-xs'>{movie.release_date?.slice(0, 4)}</span>
        </div>
      </div>
    </div>
  )
}

export default function Featured({ movies, genresList, loading, error }: FeaturedProps) {
  if (error) {
    return (
      <div className='px-4 py-8 sm:px-6 lg:px-8'>
        <p className='text-center text-rose-400'>Error: {error}</p>
      </div>
    )
  }

  const [hero, ...rest] = movies

  return (
    <div className='px-4 py-8 sm:px-6 lg:px-8'>
      <h2 className='text-white font-bold text-xl mb-4'>Now Streaming</h2>

      {/* Hero card */}
      <div className='mb-4'>
        {loading || !hero ? <SkeletonHero /> : <HeroCard movie={hero} genresList={genresList} />}
      </div>

      {/* Small cards row */}
      <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
        {loading || rest.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : rest.map((movie) => (
              <SmallCard key={movie.id} movie={movie} genresList={genresList} />
            ))}
      </div>
    </div>
  )
}