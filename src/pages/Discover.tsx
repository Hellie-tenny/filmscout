import { useState } from 'react'

const TMDB_GENRES = [
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

export default function Discover() {
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([])

  const selectedGenres = TMDB_GENRES.filter((genre) => selectedGenreIds.includes(genre.id))

  const toggleGenre = (genreId: number) => {
    setSelectedGenreIds((current) =>
      current.includes(genreId)
        ? current.filter((item) => item !== genreId)
        : [...current, genreId]
    )
  }

  return (
    <div className='px-4 py-8 text-white sm:px-6 lg:px-8'>
      <h1 className='text-2xl font-bold mb-3 sm:text-3xl'>Discover</h1>
      <p className='text-slate-300 max-w-2xl mb-8'>Choose the genres you&apos;re interested in and hit Next to continue.</p>

      <div className='flex flex-wrap gap-2'>
        {TMDB_GENRES.map((genre) => {
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

      <div className='mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-slate-300'>
          {selectedGenreIds.length > 0
            ? `${selectedGenreIds.length} genre${selectedGenreIds.length === 1 ? '' : 's'} selected`
            : 'No genres selected yet.'}
        </p>

        <button
          type='button'
          disabled={selectedGenres.length === 0}
          className='inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700'
        >
          Next
        </button>
      </div>
    </div>
  )
}
