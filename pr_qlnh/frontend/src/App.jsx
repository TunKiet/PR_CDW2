import React from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Review from './components/Review/Review'
import ReviewModerator from './components/ReviewModerator/ReviewModerator'
import Invertory from './components/Inventory/Inventory'
import TableManageAdmin from './pages/TableManagementAdmin'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReviewModerator />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/review" element={<Review />} />
        <Route path="/inventory" element={<Invertory/>} />
        <Route path="/quanlyban" element={<TableManageAdmin/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
