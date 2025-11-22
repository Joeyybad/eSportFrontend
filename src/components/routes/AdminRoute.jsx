import { Navigate } from "react-router-dom";

/**
 * Composant de Route Administrateur.
 * Redirige l'utilisateur vers la page d'accueil si le rôle n'est pas 'admin'.
 * @param {object} user - L'objet utilisateur contenant le rôle.
 * @param {JSX.Element} element - Le composant à rendre si admin.
 */
function AdminRoute({ user, element }) {
  // Si le rôle est 'admin', rendre l'élément demandé.
  // Sinon, rediriger vers / (accueil), en remplaçant l'entrée dans l'historique (replace={true})
  return user?.role === "admin" ? element : <Navigate to="/" replace />;
}

export default AdminRoute;
