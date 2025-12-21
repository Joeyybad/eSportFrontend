import Logo from "../ui/Logo";
import Button from "../ui/Button";
import { Link, NavLink } from "react-router-dom";
import {
  Gamepad2,
  HelpCircle,
  Mail,
  Settings,
  ChevronDown,
  User,
  Swords,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

function Navbar() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  // Gestion état
  const username = useAuthStore((state) => state.username);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  const userIsAdmin = role === "admin";
  const userIsLoggedIn = isLoggedIn;

  // --- STYLE DES LIENS DE NAVIGATION ---
  // Fonction pour gérer l'état Actif/Inactif avec effet Néon
  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center text-xs md:flex-row md:gap-2 md:text-sm font-bold tracking-wide transition-all duration-300 ${
      isActive
        ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] transform scale-105"
        : "text-gray-400 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
    }`;

  // --- STYLE DES MENUS DÉROULANTS (DROPDOWN) ---
  const dropdownClass =
    "absolute right-0 w-48 bg-slate-900 border border-purple-500/30 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden text-gray-200";
  const dropdownItemClass =
    "block px-4 py-3 hover:bg-purple-900/20 hover:text-purple-300 transition-colors text-sm border-b border-white/5 last:border-0";

  return (
    <nav className="fixed left-0 bottom-0 lg:top-0 lg:bottom-auto z-50 w-full bg-slate-950/90 backdrop-blur-md border-t lg:border-b border-purple-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
        {/* --- Bloc gauche : Logo --- */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Effet de lueur derrière le logo au survol */}
              <div className="absolute inset-0 bg-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <Logo size={36} />
            </div>
            <span className="hidden sm:inline font-black text-xl italic tracking-tighter text-white group-hover:text-purple-300 transition-colors">
              ESPORT<span className="text-purple-600">EVO</span>
            </span>
          </Link>
        </div>

        {/* --- Bloc centre : Liens + Admin --- */}
        <div className="flex-1 flex justify-center gap-6 md:gap-8 items-center">
          <NavLink to="/tournaments" className={navLinkClass}>
            <Gamepad2 className="w-5 h-5" />
            <span className="hidden md:inline">TOURNOIS</span>
          </NavLink>

          <NavLink to="/matchs" className={navLinkClass}>
            <Swords className="w-5 h-5" />
            <span className="hidden md:inline">MATCHS</span>
          </NavLink>

          <NavLink to="/faq" className={navLinkClass}>
            <HelpCircle className="w-5 h-5" />
            <span className="hidden md:inline">FAQ</span>
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            <Mail className="w-5 h-5" />
            <span className="hidden md:inline">CONTACT</span>
          </NavLink>

          {/* --- Menu Admin --- */}
          {userIsAdmin && (
            <div className="relative">
              {/* Admin dropdown desktop/tablette */}
              <div className="hidden md:flex items-center gap-1 relative">
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className={`flex items-center gap-1 px-3 py-1 rounded border transition-all ${
                    adminOpen
                      ? "bg-purple-900/30 border-purple-500 text-purple-300"
                      : "border-transparent text-red-400 hover:bg-red-900/10 hover:text-red-300"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase">Admin</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      adminOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {adminOpen && (
                  <div className={`${dropdownClass} top-full mt-2`}>
                    <Link to="/admin/new-team" className={dropdownItemClass}>
                      Créer une équipe
                    </Link>
                    <Link to="/admin/new-match" className={dropdownItemClass}>
                      Créer un match
                    </Link>
                    <Link
                      to="/admin/new-tournament"
                      className={dropdownItemClass}
                    >
                      Créer un tournoi
                    </Link>
                    <Link to="/admin/teams" className={dropdownItemClass}>
                      Voir les équipes
                    </Link>
                    <Link
                      to="/admin/gestion-match"
                      className={dropdownItemClass}
                    >
                      Gérer les matchs
                    </Link>
                    <Link
                      to="/admin/gestion-tournament"
                      className={dropdownItemClass}
                    >
                      Gérer les tournois
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile dropdown (< md) */}
              <div className="flex md:hidden flex-col items-center relative">
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                    adminOpen ? "text-red-400" : "text-gray-500"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      adminOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {adminOpen && (
                  <div className={`${dropdownClass} bottom-full mb-2`}>
                    <Link to="/admin/new-team" className={dropdownItemClass}>
                      + Équipe
                    </Link>
                    <Link to="/admin/new-match" className={dropdownItemClass}>
                      + Match
                    </Link>
                    <Link
                      to="/admin/gestion-match"
                      className={dropdownItemClass}
                    >
                      Gérer Matchs
                    </Link>
                    {/* J'ai raccourci les liens mobiles pour que ça rentre mieux */}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- Bloc droite : User / Connexion --- */}
        <div className="flex-1 flex justify-end items-center gap-3 relative">
          {userIsLoggedIn ? (
            <>
              {/* Desktop/Tablet user menu */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                >
                  <div className="bg-slate-800 p-2 rounded-full text-purple-400 shadow-inner">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-200 text-sm">
                    {username}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-gray-500 ${
                      userOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userOpen && (
                  <div className={`${dropdownClass} top-full mt-2`}>
                    <Link to="/profile" className={dropdownItemClass}>
                      Profil
                    </Link>
                    <Link to="/my-bets" className={dropdownItemClass}>
                      Mes paris
                    </Link>
                    <Link to="/my-wins" className={dropdownItemClass}>
                      Mes gains
                    </Link>
                    <button
                      onClick={logout}
                      className={`${dropdownItemClass} text-red-400 hover:text-red-300 w-full text-left`}
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile user menu */}
              <div className="block md:hidden relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className={`flex flex-col items-center p-1 rounded transition ${
                    userOpen ? "text-purple-400" : "text-gray-400"
                  }`}
                >
                  <User className="w-6 h-6" />
                </button>
                {userOpen && (
                  <div className={`${dropdownClass} bottom-full mb-2`}>
                    <Link to="/profile" className={dropdownItemClass}>
                      Profil
                    </Link>
                    <Link to="/my-bets" className={dropdownItemClass}>
                      Mes paris
                    </Link>
                    <button
                      onClick={logout}
                      className={`${dropdownItemClass} text-red-400`}
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* --- BOUTONS CONNEXION / INSCRIPTION --- */
            <div className="flex items-center gap-3">
              <Link to="/signup" className="hidden sm:block flex-shrink-0">
                <Button
                  text="INSCRIPTION"
                  className="bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-bold py-2 px-4 rounded text-xs transition-all shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  color="transparent" // Override prop si nécessaire
                />
              </Link>
              <Link to="/login" className="flex-shrink-0">
                <Button
                  text="CONNEXION"
                  className="bg-purple-600 text-white hover:bg-purple-500 font-bold py-2 px-4 rounded text-xs transition-all shadow-[0_0_10px_rgba(147,51,234,0.5)] hover:shadow-[0_0_20px_rgba(147,51,234,0.7)]"
                  color="#9333EA"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
