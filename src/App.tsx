import './App.css'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Landing from './components/Landing'
import Discover from './pages/Discover'
import NewReleases from './pages/NewReleases'
import Watchlist from './pages/Watchlist'

function App() {
  return (
    <div className='min-h-screen w-full bg-slate-800 text-white'>
      <Header />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/discover' element={<Discover />} />
        <Route path='/new-releases' element={<NewReleases />} />
        <Route path='/watchlist' element={<Watchlist />} />
      </Routes>
    </div>
  )
}

export default App