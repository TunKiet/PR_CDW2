import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Bạn cần đăng nhập!");
    return <Navigate to="/" replace state={{ msg: "Bạn cần đăng nhập!" }} />;
  }

  return children;
}

