/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

// Crée le contexte
export const AuthContext = createContext(null);

// Provider qui englobe l'app
export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    isLoggedIn: false,
    role: "", // "user", "admin", ou ""
  });

  //Lecture de la session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({ ...parsedUser, isLoggedIn: true });
    }
  }, []);

  // Sauvegarde de la session quand l'user change
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

// Hook pour récupérer le contexte
export function useAuth() {
  return useContext(AuthContext);
}
