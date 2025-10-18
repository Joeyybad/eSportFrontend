import { Navigate } from "react-router-dom";

function AdminRoute({ user, element }) {
  return user?.role === "admin" ? element : <Navigate to="/" />;
}

export default AdminRoute;
