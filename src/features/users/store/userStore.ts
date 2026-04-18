import { create } from "zustand";
import type { User } from "../../../types";
import { userService } from "../services/userService";

interface UserState {
  users: User[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  fetchUsers: async () => {
    set({ isLoading: true });
    const users = await userService.getUsers();
    set({ users, isLoading: false });
  },
  updateUser: async (id, updates) => {
    const updatedUser = await userService.updateUser(id, updates);
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user,
      ),
    }));
  },
  deleteUser: async (id) => {
    await userService.deleteUser(id);
    set((state) => ({ users: state.users.filter((user) => user.id !== id) }));
  },
}));
