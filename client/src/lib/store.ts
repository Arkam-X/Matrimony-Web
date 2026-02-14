import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "@/lib/types";

interface AppState {
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,

      setCurrentUser: (user) => set({ currentUser: user }),

      logout: () => {
        localStorage.removeItem("accessToken"); // clear token
        set({ currentUser: null });
      },
    }),
    {
      name: "matrimony-storage",
    }
  )
);