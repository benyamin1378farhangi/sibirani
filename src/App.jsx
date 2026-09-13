import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import PublicView from './pages/PublicView'

export default function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/view" element={<PublicView />} />
        </Routes>
      </main>
    </>
  )
}
