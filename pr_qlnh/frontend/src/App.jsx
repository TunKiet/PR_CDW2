import React from 'react'
import './App.css'
import Dashboard from './components/Dashboard/Dashboard'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Review from './components/Review/Review'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
