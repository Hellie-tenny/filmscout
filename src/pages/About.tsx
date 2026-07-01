import { Link } from 'react-router-dom'
import { Clapperboard, Bookmark, Sparkles, SearchIcon } from 'lucide-react'

const FEATURES = [
  {
    icon: <Clapperboard className='w-5 h-5 text-green-400' />,
    title: 'Discover by Genre',
    description: 'Pick the genres you are in the mood for and get top-rated recommendations instantly.',
  },
  {
    icon: <Sparkles className='w-5 h-5 text-green-400' />,
    title: 'New Releases',
    description: 'Browse the latest movies and shows that are already available on streaming platforms.',
  },
  {
    icon: <SearchIcon className='w-5 h-5 text-green-400' />,
    title: 'Search',
    description: 'Already have something in mind? Search directly and see if it is streaming right now.',
  },
  {
    icon: <Bookmark className='w-5 h-5 text-green-400' />,
    title: 'Your Watchlist',
    description: 'Save anything that catches your eye and come back to it whenever you are ready to watch.',
  },
]

export default function About() {
  return (
    <div className='px-4 py-12 text-white sm:px-6 lg:px-8 max-w-3xl mx-auto'>

      {/* hero text */}
      <div className='mb-10'>
        <p className='text-xs font-semibold uppercase tracking-widest text-green-400 mb-3'>
          About FilmScout
        </p>
        <h1 className='text-3xl sm:text-4xl font-extrabold leading-tight mb-4'>
          Built for people who love watching.
        </h1>
        <p className='text-slate-300 leading-relaxed'>
          FilmScout started as a personal project born out of a simple frustration — spending more time
          deciding what to watch than actually watching. It is built for movie and TV lovers who want
          quick, honest recommendations without the noise.
        </p>
        <p className='text-slate-300 leading-relaxed mt-4'>
          Whether you are looking for something new in a genre you love, checking what just landed on
          streaming, or searching for a specific title, FilmScout helps you find your next favourite
          watch — fast.
        </p>
      </div>

      {/* features */}
      <div className='mb-10'>
        <h2 className='text-lg font-bold mb-5'>What FilmScout does</h2>
        <div className='flex flex-col gap-4'>
          {FEATURES.map((f) => (
            <div key={f.title} className='flex gap-4 rounded-xl bg-slate-900/60 border border-slate-700/50 p-4'>
              <div className='mt-0.5 flex-shrink-0'>{f.icon}</div>
              <div>
                <h3 className='text-sm font-semibold mb-1'>{f.title}</h3>
                <p className='text-xs text-slate-400 leading-relaxed'>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* data attribution */}
      <div className='mb-10 rounded-xl bg-slate-900/60 border border-slate-700/50 p-5'>
        <h2 className='text-sm font-bold mb-2'>Data</h2>
        <p className='text-xs text-slate-400 leading-relaxed'>
          FilmScout uses the TMDB API to power movie and TV show data, including titles, ratings,
          streaming availability, and trailers. FilmScout is not endorsed or certified by TMDB.
        </p>
      </div>

      {/* cta */}
      <div className='text-center'>
        <Link
          to='/discover'
          className='rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-green-400'
        >
          Start Discovering
        </Link>
      </div>

    </div>
  )
}