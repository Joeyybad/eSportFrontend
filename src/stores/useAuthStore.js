import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { jwtDecode } from "jwt-decode"; //

const initialState = {
  isLoggedIn: false,
  id: null,
  username: "",
  email: "",
  role: "",
  token: "",
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 👈 Ajoute 'get' ici pour lire l'état actuel
      ...initialState,

      login: (userData) => {
        set({
          isLoggedIn: true,
          token: userData.token,
          id: userData.user.id,
          username: userData.user.username,
          email: userData.user.email,
          role: userData.user.isAdmin ? "admin" : "user",
        });
      },

      setUserProfile: (profileData) => {
        set((state) => ({
          username:
            profileData.username !== undefined
              ? profileData.username
              : state.username,
          email:
            profileData.email !== undefined ? profileData.email : state.email,
        }));
      },

      logout: () => {
        set(initialState);
        localStorage.removeItem("auth-storage"); // Nettoyage explicite
      },

      checkAuth: () => {
        const token = get().token;

        if (!token) return;

        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000; // En secondes

          // Si le token expire dans le passé (ou très bientôt)
          if (decoded.exp < currentTime) {
            console.log("Session expirée détectée au démarrage.");
            get().logout(); // On déconnecte
          } else {
            console.log("Session valide.");
          }
        } catch (error) {
          // Si le token est corrompu
          console.error("Token invalide détecté :", error);
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Optionnel : On peut lancer la vérif dès que le storage est chargé
      onRehydrateStorage: () => (state) => {
        state?.checkAuth();
      },
    }
  )
);
