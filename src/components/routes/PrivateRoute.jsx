import { Navigate } from "react-router-dom";

/**
 * Composant de Route Privée.
 * Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié.
 * @param {boolean} isAuthenticated - État d'authentification de l'utilisateur.
 * @param {JSX.Element} element - Le composant à rendre si authentifié.
 */
function PrivateRoute({ isAuthenticated, element }) {
  // Si l'utilisateur est authentifié, rendre l'élément demandé.
  // Sinon, rediriger vers /login, en remplaçant l'entrée dans l'historique (replace={true})
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

export default PrivateRoute;
