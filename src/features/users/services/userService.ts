import type { User } from "../../../types";
import { apiClient } from "../../../services/apiClient";

interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: User["role"];
  photoUrl?: string;
  status?: User["status"];
  createdAt?: string;
}

function mapUser(user: ApiUser): User {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    photoUrl: user.photoUrl,
    status: user.status,
    joined: user.createdAt,
  };
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<ApiUser[]>("/api/users");
    return response.data.map(mapUser);
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiUser>(`/api/users/${id}`, updates);
    return mapUser(response.data);
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/api/users/${id}`);
  },
};
