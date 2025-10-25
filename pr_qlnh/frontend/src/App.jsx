import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Review from './components/Review/Review';
import ReviewModerator from './components/ReviewModerator/ReviewModerator';
import Invertory from './components/Inventory/Inventory';
import TableManagementAdmin from './pages/TableManagementAdmin';

function App() {
  return (
    // Tạm thời test trực tiếp TableManagementAdmin
    <div className="min-h-screen lg:flex">
      <TableManagementAdmin />
    </div>
  );
}

export default App;
