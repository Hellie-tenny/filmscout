export type Movie = {
  id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  genre_ids: number[]
  poster_path: string | null
}

export const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'
