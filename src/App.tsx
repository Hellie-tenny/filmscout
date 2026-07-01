import './App.css'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import Landing from './components/Landing'
import Discover from './pages/Discover'
import NewReleases from './pages/NewReleases'
import Watchlist from './pages/Watchlist'
import Search from './pages/Search'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className='min-h-screen w-full bg-slate-800 text-white flex flex-col'>
      <Header />
      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/discover' element={<Discover />} />
          <Route path='/new-releases' element={<NewReleases />} />
          <Route path='/watchlist' element={<Watchlist />} />
          <Route path='/search' element={<Search />} />
          <Route path='/about' element={<About />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App