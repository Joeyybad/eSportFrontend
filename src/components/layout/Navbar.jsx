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
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const navigate = useNavigate(); // hook pour la navigation
  const { user, setUser } = useAuth(); //récupère user depuis le contexte
  return (
    <nav className="fixed left-0 bottom-0 lg:top-0 lg:bottom-auto z-50 w-full bg-white shadow-md border-t border-gray-200 lg:border-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
        {/* --- Bloc gauche : Logo --- */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={36} />
            <span className="hidden sm:inline font-bold text-lg text-gray-900">
              E-sport Evolution
            </span>
          </Link>
        </div>

        {/* --- Bloc centre : Liens + Admin --- */}
        <div className="flex-1 flex justify-center gap-6 items-center">
          <NavLink
            to="/bets"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs md:flex-row md:gap-2 md:text-base transition ${
                isActive
                  ? "text-purple-600 font-medium"
                  : "text-gray-700 hover:text-purple-600"
              }`
            }
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="hidden md:inline">Paris</span>
          </NavLink>

          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs md:flex-row md:gap-2 md:text-base transition ${
                isActive
                  ? "text-purple-600 font-medium"
                  : "text-gray-700 hover:text-purple-600"
              }`
            }
          >
            <HelpCircle className="w-5 h-5" />
            <span className="hidden md:inline">FAQ</span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs md:flex-row md:gap-2 md:text-base transition ${
                isActive
                  ? "text-purple-600 font-medium"
                  : "text-gray-700 hover:text-purple-600"
              }`
            }
          >
            <Mail className="w-5 h-5" />
            <span className="hidden md:inline">Contact</span>
          </NavLink>

          {/* --- Menu Admin --- */}
          {user?.role === "admin" && (
            <div className="relative">
              {/* Desktop dropdown */}
              <div className="hidden md:flex items-center gap-1 relative group">
                <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition">
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition z-50">
                  <Link
                    to="/admin/new-team"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Créer une équipe
                  </Link>
                  <Link
                    to="/admin/new-match"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Créer un match
                  </Link>
                </div>
              </div>

              {/* Mobile dropdown */}
              <div className="flex md:hidden flex-col items-center relative">
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition"
                >
                  <Settings className="w-5 h-5" />
                  <span>Admin</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      adminOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {adminOpen && (
                  <div className="absolute bottom-full mb-2 w-40 bg-white border rounded shadow-lg flex flex-col z-50">
                    <Link
                      to="/admin/new-team"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Créer une équipe
                    </Link>
                    <Link
                      to="/admin/new-match"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Créer un match
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- Bloc droite : User / Connexion --- */}
        <div className="flex-1 flex justify-end items-center gap-3 relative ">
          {user?.isLoggedIn ? (
            <>
              {/* Desktop user menu */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex flex-col items-center p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <User className="w-6 h-6 text-gray-700" />
                  <span className="font-medium text-purple-600 hover:text-indigo-600 text-sm mt-1">
                    {user?.username}
                  </span>
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded shadow-lg flex flex-col z-50">
                    <Link to="/profile" className="px-4 py-2 hover:bg-gray-100">
                      Profil
                    </Link>
                    <Link to="/my-bets" className="px-4 py-2 hover:bg-gray-100">
                      Mes paris
                    </Link>
                    <Link to="/my-wins" className="px-4 py-2 hover:bg-gray-100">
                      Mes gains
                    </Link>
                    <button
                      onClick={() => {
                        setUser({
                          isLoggedIn: false,
                          role: "",
                          username: "",
                          email: "",
                        });
                        navigate("/login");
                      }}
                      className="text-left px-4 py-2 hover:bg-gray-100 transition"
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
                  className="flex flex-col items-center p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <User className="w-6 h-6 text-gray-700" />
                  <span className="font-medium  text-purple-600 hover:text-indigo-600 text-sm mt-1">
                    {user?.username}
                  </span>
                </button>
                {userOpen && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border rounded shadow-lg flex flex-col z-50">
                    <Link to="/profile" className="px-4 py-2 hover:bg-gray-100">
                      Profil
                    </Link>
                    <Link to="/my-bets" className="px-4 py-2 hover:bg-gray-100">
                      Mes paris
                    </Link>
                    <Link to="/my-wins" className="px-4 py-2 hover:bg-gray-100">
                      Mes gains
                    </Link>
                    <button
                      onClick={() => {
                        setUser({
                          isLoggedIn: false,
                          role: "",
                          username: "",
                          email: "",
                        });
                        navigate("/login");
                      }}
                      className="text-left px-4 py-2 hover:bg-gray-100 transition"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/signup" className="flex-shrink-0">
                <Button
                  text="Inscription"
                  color="#ffffff"
                  style={{
                    border: "1px solid #9333EA",
                    color: "#9333EA",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </Link>
              <Link to="/login" className="flex-shrink-0">
                <Button
                  text="Connexion"
                  color="#9333EA"
                  style={{
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
