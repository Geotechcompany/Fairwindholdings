import create from "zustand";
import { UserData } from "@/types/user";

type UserStore = {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
}));
