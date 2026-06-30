import { useEffect } from 'react'
import useMediaDetails from '../hooks/useMediaDetails'
import type { MediaItem, MediaType } from '../types/media'

type Props = {
  item: MediaItem
  mediaType: MediaType
  genreMap: Record<number, string>
  onClose: () => void
  onSelect: (item: MediaItem) => void
  isInWatchlist: boolean
  onToggleWatchlist: () => void
}

export default function MediaModal({ item, mediaType, genreMap, onClose, onSelect, isInWatchlist, onToggleWatchlist }: Props) {
  const { details, loading, error } = useMediaDetails(item.id, mediaType)

  // close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    // backdrop
    <div
      className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-0 sm:px-4'
      onClick={onClose}
    >
      {/* modal panel */}
      <div
        className='relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-slate-900 text-white'
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          type='button'
          onClick={onClose}
          className='absolute top-3 right-3 z-10 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70'
        >
          ✕
        </button>

        {/* backdrop image */}
        {loading ? (
          <div className='w-full h-52 bg-slate-800 animate-pulse' />
        ) : details?.backdrop_path ? (
          <div className='relative w-full h-52 overflow-hidden rounded-t-2xl sm:rounded-t-2xl'>
            <img
              src={`https://image.tmdb.org/t/p/w780${details.backdrop_path}`}
              alt={details.title}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent' />
          </div>
        ) : (
          <div className='w-full h-52 bg-slate-800 flex items-center justify-center text-slate-500'>
            No image
          </div>
        )}

        <div className='px-5 pb-6'>

          {/* title + meta */}
          <div className='mt-3'>
            <h2 className='text-xl font-bold leading-snug'>
              {loading ? <span className='block h-6 w-2/3 rounded bg-slate-700 animate-pulse' /> : details?.title ?? item.title}
            </h2>

            {!loading && details && (
              <div className='flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-400'>
                <span>⭐ {details.vote_average.toFixed(1)}</span>
                <span>{details.release_date?.slice(0, 4)}</span>
                {details.runtime && <span>{details.runtime} min</span>}
                {details.number_of_seasons && (
                  <span>{details.number_of_seasons} season{details.number_of_seasons > 1 ? 's' : ''}</span>
                )}
              </div>
            )}

            {!loading && details?.tagline && (
              <p className='mt-1 text-xs italic text-slate-500'>{details.tagline}</p>
            )}
          </div>
          {!loading && details && (
            <button
              type='button'
              onClick={onToggleWatchlist}
              className={`mt-3 rounded-full px-4 py-2 text-sm font-medium transition-colors ${isInWatchlist
                  ? 'bg-green-500 text-slate-950'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
            >
              {isInWatchlist ? '✓ Added to Watchlist' : '+ Add to Watchlist'}
            </button>
          )}
          {/* genre tags */}
          {!loading && details && (
            <div className='flex flex-wrap gap-1 mt-3'>
              {details.genre_ids.map((gid) => (
                <span key={gid} className='rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300'>
                  {genreMap[gid] ?? 'Unknown'}
                </span>
              ))}
            </div>
          )}

          {/* overview */}
          {!loading && details?.overview && (
            <p className='mt-3 text-sm text-slate-300 leading-relaxed'>{details.overview}</p>
          )}

          {/* streaming providers */}
          {!loading && details && details.providers.length > 0 && (
            <div className='mt-4'>
              <p className='text-xs text-slate-400 mb-2'>Available on</p>
              <div className='flex flex-wrap gap-2'>
                {details.providers.map((p) => (
                  <div key={p.provider_name} className='flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1'>
                    <img
                      src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                      alt={p.provider_name}
                      className='h-5 w-5 rounded'
                    />
                    <span className='text-xs text-slate-300'>{p.provider_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && details && details.providers.length === 0 && (
            <p className='mt-4 text-xs text-slate-500'>Not currently on streaming platforms.</p>
          )}

          {/* trailer */}
          {!loading && details?.trailerKey && (
            <div className='mt-4'>
              <p className='text-xs text-slate-400 mb-2'>Trailer</p>
              <div className='relative w-full aspect-video rounded-lg overflow-hidden'>
                <iframe
                  src={`https://www.youtube.com/embed/${details.trailerKey}`}
                  title='Trailer'
                  allowFullScreen
                  className='absolute inset-0 w-full h-full'
                />
              </div>
            </div>
          )}

          {/* recommendations */}
          {!loading && details && details.recommendations.length > 0 && (
            <div className='mt-6'>
              <p className='text-sm font-semibold mb-3'>More Like This</p>
              <div className='flex gap-3 overflow-x-auto pb-1 scrollbar-hide'>
                {details.recommendations.map((rec) => (
                  <button
                    key={rec.id}
                    type='button'
                    onClick={() => onSelect(rec)}
                    className='flex-shrink-0 w-28 text-left'
                  >
                    {rec.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                        alt={rec.title}
                        className='w-full h-40 rounded-lg object-cover'
                      />
                    ) : (
                      <div className='w-full h-40 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 text-xs'>
                        No image
                      </div>
                    )}
                    <p className='mt-1 text-xs text-slate-300 line-clamp-2 leading-snug'>{rec.title}</p>
                    <p className='text-xs text-amber-400'>⭐ {rec.vote_average.toFixed(1)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* loading skeleton for details */}
          {loading && (
            <div className='mt-3 space-y-2 animate-pulse'>
              <div className='h-4 w-full rounded bg-slate-700' />
              <div className='h-4 w-5/6 rounded bg-slate-700' />
              <div className='h-4 w-4/6 rounded bg-slate-700' />
            </div>
          )}

          {error && (
            <p className='mt-3 text-sm text-rose-400'>Failed to load details.</p>
          )}

        </div>
      </div>
    </div>
  )
}