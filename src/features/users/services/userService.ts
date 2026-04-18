import type { User } from "../../../types";
import { authService } from "../../auth/services/authService";

export const userService = {
  async getUsers(): Promise<User[]> {
    return authService.getUsers();
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    // Mock update - in real app, call API
    const users = await authService.getUsers();
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) throw new Error("User not found");
    const updatedUser = { ...users[userIndex], ...updates };
    // In mock, we can't persist, but assume it works
    return updatedUser;
  },

  async deleteUser(id: string): Promise<void> {
    // Mock delete
    console.log("Deleting user", id);
  },
};
