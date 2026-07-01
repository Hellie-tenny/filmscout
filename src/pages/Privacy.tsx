export default function Privacy() {
  return (
    <div className='px-4 py-12 text-white sm:px-6 lg:px-8 max-w-3xl mx-auto'>
      <p className='text-xs font-semibold uppercase tracking-widest text-green-400 mb-3'>
        Legal
      </p>
      <h1 className='text-3xl font-extrabold mb-2'>Privacy Policy</h1>
      <p className='text-xs text-slate-500 mb-8'>Last updated: {new Date().getFullYear()}</p>

      <div className='flex flex-col gap-8 text-slate-300 text-sm leading-relaxed'>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Overview</h2>
          <p>
            FilmScout is a free, fan-built web application. We are committed to being transparent
            about how your data is handled. This policy explains what information is collected and
            how it is used.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Information We Collect</h2>
          <p className='mb-3'>
            FilmScout does not require you to create an account or provide any personal information
            to use the app. All preferences — your watchlist, disliked titles, and genre selections
            — are stored locally on your device using your browser's localStorage and never sent to
            any server.
          </p>
          <p>
            We use Google Analytics to collect anonymous usage data. This includes pages visited,
            time spent on the app, device type, and general location (country/region level). This
            data helps us understand how FilmScout is used and improve the experience. Google
            Analytics does not identify you personally.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Cookies</h2>
          <p>
            Google Analytics uses cookies to track usage sessions. These cookies are set by Google
            and are subject to Google's own privacy policy. You can opt out of Google Analytics
            tracking by using the{' '}
            <span className='text-green-400'>Google Analytics Opt-out Browser Add-on</span>
            {' '}or by disabling cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Third-Party Services</h2>
          <p>
            FilmScout uses the TMDB API to fetch movie and TV show data. FilmScout does not share
            any user data with TMDB. Please refer to TMDB's own privacy policy for information on
            how they handle data.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Data Storage</h2>
          <p>
            Your watchlist, disliked titles, and preferences are stored in your browser's
            localStorage. This data never leaves your device. You can clear it at any time by
            clearing your browser's site data or local storage for this site.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be reflected on
            this page with an updated date. Continued use of FilmScout after changes are posted
            constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Contact</h2>
          <p>
            FilmScout is a personal fan project. If you have any questions about this privacy
            policy, you can reach out via the project's public repository or contact page.
          </p>
        </section>

      </div>
    </div>
  )
}