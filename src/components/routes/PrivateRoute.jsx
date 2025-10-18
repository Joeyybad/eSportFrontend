import { Navigate } from "react-router-dom";

function PrivateRoute({ isAuthenticated, element }) {
  return isAuthenticated ? element : <Navigate to="/login" />;
}

export default PrivateRoute;
