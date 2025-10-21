import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Định tuyến cho các trang khác nhau */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path='/user/dashboard' element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App