export default function Terms() {
  return (
    <div className='px-4 py-12 text-white sm:px-6 lg:px-8 max-w-3xl mx-auto'>
      <p className='text-xs font-semibold uppercase tracking-widest text-green-400 mb-3'>
        Legal
      </p>
      <h1 className='text-3xl font-extrabold mb-2'>Terms of Use</h1>
      <p className='text-xs text-slate-500 mb-8'>Last updated: {new Date().getFullYear()}</p>

      <div className='flex flex-col gap-8 text-slate-300 text-sm leading-relaxed'>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>About FilmScout</h2>
          <p>
            FilmScout is a free, fan-built web application designed to help users discover movies
            and TV shows available on streaming platforms. By using FilmScout, you agree to these
            terms of use.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Use of the App</h2>
          <p className='mb-3'>
            FilmScout is provided free of charge for personal, non-commercial use. You may not use
            FilmScout for any unlawful purpose or in any way that could damage, disable, or impair
            the service.
          </p>
          <p>
            FilmScout is a recommendation and discovery tool only. We do not host, stream, or
            provide access to any movies or TV shows directly. All streaming is done through
            third-party platforms.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Content and Accuracy</h2>
          <p>
            Movie and TV show data, including titles, ratings, streaming availability, and trailers,
            is provided by the TMDB API. FilmScout does not guarantee the accuracy, completeness,
            or availability of this data. Streaming availability in particular may change at any
            time and varies by region.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Intellectual Property</h2>
          <p>
            All movie and TV show data, images, and related content are the property of their
            respective owners. FilmScout does not claim ownership of any third-party content
            displayed within the app. TMDB branding and data remain the property of TMDB.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Availability</h2>
          <p>
            FilmScout is provided as-is. We do not guarantee that the app will be available at all
            times or that it will be free from errors. We reserve the right to modify, suspend, or
            discontinue the service at any time without notice.
          </p>
        </section>

        <section>
          <h2 className='text-base font-bold text-white mb-2'>Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Any changes will be reflected on this page
            with an updated date. Continued use of FilmScout after changes are posted constitutes
            your acceptance of the updated terms.
          </p>
        </section>

      </div>
    </div>
  )
}