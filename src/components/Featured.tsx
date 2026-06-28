type FeaturedProps = {
    movies: Array<{
        id?: number
        title?: string
        poster_path?: string
        genre_ids?: number[]
    }>
    genresList: Record<number, string>
}

export default function Featured({ movies, genresList }: FeaturedProps) {
    return (
        <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <h1 className='text-white font-bold text-center text-2xl mb-6'>Featured Movies</h1>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {
                    movies.map((movie, index) => (
                        <div className='relative overflow-hidden rounded-lg bg-red-500 h-80' key={movie.id ?? `movie-${index}`}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                loading="lazy"
                                className='w-full h-full object-cover'
                            />

                            <div className='absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 to-black/0 p-3'>
                                <h2 className='text-white font-bold'>{movie.title}</h2>
                                <div className='mt-1 flex flex-wrap gap-2'>
                                    {(movie.genre_ids ?? []).map((genreId: number, genreIndex: number) => (
                                        <span key={`${genreId}-${genreIndex}`} className='text-sm text-green-500'>
                                            {genresList[genreId] ?? 'Unknown'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}