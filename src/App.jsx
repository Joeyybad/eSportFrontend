import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./pages/home";
import NewTeam from "./pages/newTeam";
import Login from "./pages/login";
import Bets from "./pages/bets";
import Bet from "./pages/bet";
import Signup from "./pages/signup";
import Profile from "./pages/profil";
import MyBets from "./pages/my-bets";
import MyWins from "./pages/my-wins";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bets" element={<Bets />} />
          <Route path="/bet/:id" element={<Bet />} />
          <Route path="/my-bets" element={<MyBets />} />
          <Route path="/my-wins" element={<MyWins />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/new-team" element={<NewTeam />} />

          {/* autres routes */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
