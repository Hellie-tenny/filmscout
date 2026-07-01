import { useState } from 'react'
import useWatchlist from '../hooks/useWatchlist'
import MediaModal from '../components/MediaModal'
import type { MediaItem } from '../types/media'
import useDisliked from '../hooks/useDisliked'
import { Tv } from 'lucide-react'

export default function Watchlist() {
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

    const GENRE_MAP: Record<number, string> = Object.fromEntries(
        [...MOVIE_GENRES, ...TV_GENRES].map((g) => [g.id, g.name])
    )
    const { watchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist } = useWatchlist()
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
    const { isDisliked, toggleDisliked } = useDisliked()

    const releaseYear = (date: string) => date?.slice(0, 4) ?? '—'

    return (
        <div className='px-4 py-8 text-white sm:px-6 lg:px-8'>
            <h1 className='text-2xl font-bold mb-3 sm:text-3xl'>Watchlist</h1>
            <p className='text-slate-300 max-w-2xl mb-6'>
                {watchlist.length > 0
                    ? `${watchlist.length} title${watchlist.length === 1 ? '' : 's'} saved`
                    : 'Nothing saved yet.'}
            </p>

            {watchlist.length === 0 ? (
                <div className='mt-10 flex flex-col items-center text-center text-slate-500'>
                    <Tv className='w-10 h-10 text-slate-600 mb-3' />
                    <p className='text-sm'>Add movies or shows to your watchlist to see them here.</p>
                </div>
            ) : (
                <div className='flex flex-col gap-3'>
                    {watchlist.map((movie) => (
                        <div
                            key={movie.id}
                            className='flex items-center gap-4 rounded-lg bg-slate-900/50 p-3 cursor-pointer hover:bg-slate-800/70 transition-colors'
                            onClick={() => setSelectedItem(movie)}
                        >
                            {/* thumbnail */}
                            <div className='flex-shrink-0 w-14 h-20 sm:w-16 sm:h-24 rounded-md overflow-hidden bg-slate-800'>
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center text-slate-500 text-xs'>
                                        No image
                                    </div>
                                )}
                            </div>

                            {/* info */}
                            <div className='flex-1 min-w-0'>
                                <h3 className='text-sm sm:text-base font-semibold truncate'>{movie.title}</h3>
                                <div className='flex items-center gap-3 mt-1 text-xs text-slate-400'>
                                    <span>{releaseYear(movie.release_date)}</span>
                                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                                    <span className='hidden sm:inline rounded-full bg-slate-700 px-2 py-0.5 text-slate-300'>
                                        {movie.media_type === 'movie' ? 'Movie' : 'TV Show'}
                                    </span>
                                </div>
                            </div>

                            {/* remove button */}
                            <button
                                type='button'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeFromWatchlist(movie.id)
                                }}
                                className='flex-shrink-0 rounded-full bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-rose-500 hover:text-white transition-colors'
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

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