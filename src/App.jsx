import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./pages/home";
import Login from "./pages/login";
import Matchs from "./pages/matchs";
import Match from "./pages/match";
import Tournaments from "./pages/tournaments";
import Tournament from "./pages/tournament";
import Signup from "./pages/signup";
import Profile from "./pages/profil";
import MyBets from "./pages/my-bets";
import MyWins from "./pages/my-wins";
import Faq from "./pages/faq";
import Conditions from "./pages/conditions";
import NewTeam from "./pages/admin/newTeam";
import NewMatch from "./pages/admin/newMatch";
import NewTournament from "./pages/admin/newTournament";
import GestionMatch from "./pages/admin/gestionMatch";
import EditMatch from "./pages/admin/editMatch";
import GestionTournament from "./pages/admin/gestionTournament";
import EditTournament from "./pages/admin/editTournament";
import Teams from "./pages/admin/teams";
import Contact from "./pages/contact";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute";
import { useAuthStore } from "./stores/useAuthStore";
import { useState, useEffect } from "react";

function AppRoutes() {
  // 1. Gérer l'état d'hydratation et récupérer l'état du store (TOUS LES HOOKS EN PREMIER)

  // CORRECTION ICI : On récupère les valeurs une par une (Sélecteurs Atomiques)
  // Cela garantit que React ne détecte pas de "nouvel objet" à chaque rendu, stoppant la boucle infinie.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  // On reconstruit l'objet 'user' localement pour le passer aux props plus bas
  const user = { isLoggedIn, token, role };

  // Hook 2: Gérer l'état d'hydratation du store Zustand
  const [isHydrated, setIsHydrated] = useState(
    useAuthStore.persist.hasHydrated()
  );

  // Hook 3: Effect pour l'écoute de l'hydratation
  useEffect(() => {
    // Si l'état n'est pas encore hydraté, on écoute l'événement de fin d'hydratation
    if (!isHydrated) {
      // useAuthStore.persist.onFinish est un outil fourni par le middleware persist
      const unsubscribe = useAuthStore.persist.onFinish(() => {
        setIsHydrated(true);
      });
      // Fonction de nettoyage pour retirer l'écouteur lors du démontage du composant
      return () => unsubscribe();
    }
  }, [isHydrated]);

  // 2. Vérification conditionnelle de l'hydratation (vient après tous les appels de Hooks)
  if (!isHydrated) {
    // Ceci empêche l'exécution du code dépendant de l'état du store tant qu'il n'est pas stable.
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-purple-600 p-4 rounded-lg bg-white shadow-lg animate-pulse">
          Chargement de l'authentification...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/matchs" element={<Matchs />} />
        <Route path="/match/:id" element={<Match />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/conditions" element={<Conditions />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:id/matches" element={<Tournament />} />

        {/* Routes protégées */}
        <Route
          path="/profile"
          element={
            <PrivateRoute
              isAuthenticated={user.isLoggedIn}
              element={<Profile />}
            />
          }
        />
        <Route
          path="/my-bets"
          element={
            <PrivateRoute
              isAuthenticated={user.isLoggedIn}
              element={<MyBets />}
            />
          }
        />
        <Route
          path="/my-wins"
          element={
            <PrivateRoute
              isAuthenticated={user.isLoggedIn}
              element={<MyWins />}
            />
          }
        />

        {/* Routes admin */}
        <Route
          path="/admin/new-team"
          element={<AdminRoute user={user} element={<NewTeam />} />}
        />
        <Route
          path="/admin/new-match"
          element={<AdminRoute user={user} element={<NewMatch />} />}
        />
        <Route
          path="/admin/new-tournament"
          element={<AdminRoute user={user} element={<NewTournament />} />}
        />
        <Route
          path="/admin/teams"
          element={<AdminRoute user={user} element={<Teams />} />}
        />
        <Route
          path="/admin/gestion-match"
          element={<AdminRoute user={user} element={<GestionMatch />} />}
        />
        <Route
          path="/admin/gestion-tournament"
          element={<AdminRoute user={user} element={<GestionTournament />} />}
        />
        <Route
          path="/admin/match/:id/edit"
          element={<AdminRoute user={user} element={<EditMatch />} />}
        />
        <Route
          path="/admin/tournament/:id/edit"
          element={<AdminRoute user={user} element={<EditTournament />} />}
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
