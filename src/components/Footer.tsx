import { Link } from 'react-router-dom'

const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Discover', to: '/discover' },
    { label: 'New Releases', to: '/new-releases' },
    { label: 'Watchlist', to: '/watchlist' },
    { label: 'Search', to: '/search' },
]

const LEGAL_LINKS = [
    { label: 'About', to: '/about' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Use', to: '/terms' },
]

export default function Footer() {
    return (
        <footer className='border-t border-slate-700/50 bg-slate-900/40 px-4 py-10 sm:px-6 lg:px-8 mt-8'>
            <div className='max-w-5xl mx-auto'>

                {/* top row */}
                <div className='flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between'>

                    {/* branding */}
                    <div>
                        <Link to='/' className='text-lg font-bold text-green-500'>
                            FilmScout
                        </Link>
                        <p className='mt-1 text-xs text-slate-400 max-w-xs'>
                            Find your next favourite watch. Discover top-rated movies and shows streaming right now.
                        </p>
                    </div>

                    {/* nav links */}
                    <div className='flex flex-col gap-1'>
                        <p className='text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1'>
                            Navigate
                        </p>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className='text-sm text-slate-400 hover:text-green-400 transition-colors'
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* legal links */}
                    <div className='flex flex-col gap-1'>
                        <p className='text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1'>
                            Legal
                        </p>
                        {LEGAL_LINKS.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className='text-sm text-slate-400 hover:text-green-400 transition-colors'
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* bottom row */}
                <div className='mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-slate-700/50 pt-6'>
                    <p className='text-xs text-slate-500'>
                        {new Date().getFullYear()} FilmScout. All rights reserved.
                    </p>
                    <p className='text-xs text-slate-600'>
                        Movie data provided by TMDB. FilmScout is not endorsed by TMDB.
                    </p>
                </div>

            </div>
        </footer>
    )
}