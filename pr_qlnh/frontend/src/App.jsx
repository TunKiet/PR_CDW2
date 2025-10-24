import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderPage from "./pages/OrderPage";
import DishTable from "./components/08_hao-QLMonAn/DishTable";

function App() {
  // Vì đã định nghĩa OrderPage ở trên, chúng ta sử dụng nó ở đây
  return (
    <Router>
      <Routes>
        <Route path="/dishtable" element={<DishTable />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
