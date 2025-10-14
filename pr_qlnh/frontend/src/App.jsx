import './App.css'
import Dashboard from './components/Dashboard/Dashboard'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sidebar" element={<Sidebar />} />
      </Routes>
    </Router>
  )
}

export default App
