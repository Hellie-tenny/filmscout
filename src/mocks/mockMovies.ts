import type { MediaItem } from '../types/media'

const mockMovies: MediaItem[] = [
  {
    id: 1000001,
    title: 'The Mockingbird Heist',
    overview: 'A clever group of friends attempt a daring art heist with unexpected consequences.',
    release_date: '2021-07-16',
    vote_average: 7.8,
    genre_ids: [35, 80],
    poster_path: null,
    media_type: 'movie',
  },
  {
    id: 1000002,
    title: 'Neon Skies',
    overview: 'A synthetic city glows as two strangers find connection in the chaos.',
    release_date: '2020-11-05',
    vote_average: 8.1,
    genre_ids: [18, 878],
    poster_path: null,
    media_type: 'movie',
  },
  {
    id: 1000003,
    title: 'Last Light',
    overview: 'In the final hours of daylight, a small town confronts its secrets.',
    release_date: '2019-03-22',
    vote_average: 7.2,
    genre_ids: [18, 53],
    poster_path: null,
    media_type: 'movie',
  },
]

export default mockMovies