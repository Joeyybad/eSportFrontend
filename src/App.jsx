import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./pages/home";
import Login from "./pages/login";
import Bets from "./pages/bets";
import Bet from "./pages/bet";
import Signup from "./pages/signup";
import Profile from "./pages/profil";
import MyBets from "./pages/my-bets";
import MyWins from "./pages/my-wins";
import Faq from "./pages/faq";
import NewTeam from "./pages/admin/newTeam";
import NewMatch from "./pages/admin/newMatch";
import Contact from "./pages/contact";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bets" element={<Bets />} />
        <Route path="/bet/:id" element={<Bet />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />

        {/* Routes protégées */}
        <Route
          path="/profile"
          element={
            <PrivateRoute
              isAuthenticated={user?.isLoggedIn}
              element={<Profile />}
            />
          }
        />
        <Route
          path="/my-bets"
          element={
            <PrivateRoute
              isAuthenticated={user?.isLoggedIn}
              element={<MyBets />}
            />
          }
        />
        <Route
          path="/my-wins"
          element={
            <PrivateRoute
              isAuthenticated={user?.isLoggedIn}
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
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
