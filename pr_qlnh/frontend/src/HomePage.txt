import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import OrderPage from "./pages/OrderPage";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={<OrderPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
