/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

// Crée le contexte
export const AuthContext = createContext(null);

// Provider qui englobe l'app
export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    isLoggedIn: false,
    role: "", // "user", "admin", ou ""
  });

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
