/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    isLoggedIn: false,
    id: null,
    username: "",
    email: "",
    role: "",
    token: "",
  });

  // Vérifie le token dès le chargement
  useEffect(() => {
    const checkToken = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);

      try {
        const res = await fetch("http://localhost:5000/api/user/verify", {
          headers: {
            Authorization: `Bearer ${parsedUser.token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.valid) {
          // Token encore valide : on restaure la session
          setUser({ ...parsedUser, isLoggedIn: true });
        } else {
          // Token expiré ou invalide : on le nettoie
          localStorage.removeItem("user");
          setUser({
            isLoggedIn: false,
            id: null,
            token: "",
            username: "",
            email: "",
            role: "",
          });
        }
      } catch (err) {
        console.error("Erreur vérification token :", err);
        localStorage.removeItem("user");
        setUser({
          isLoggedIn: false,
          id: null,
          token: "",
          username: "",
          email: "",
          role: "",
        });
      }
    };

    checkToken();
  }, []);

  // Sauvegarde automatique de la session si l'utilisateur change
  useEffect(() => {
    if (user.isLoggedIn) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
