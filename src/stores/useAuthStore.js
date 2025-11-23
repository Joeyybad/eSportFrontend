import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialState = {
  isLoggedIn: false,
  id: null,
  username: "",
  email: "",
  role: "",
  token: "",
};

export const useAuthStore = create(
  // Le middleware 'persist' permet de lire et d'écrire dans le localStorage
  persist(
    (set) => ({
      // État initial
      ...initialState,

      // Fonction de connexion
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
          // Ne met à jour que les champs fournis
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
      },
    }),
    {
      name: "auth-storage", // Nom de la clé dans le localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
