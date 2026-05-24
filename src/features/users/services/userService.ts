import type { User } from "../../../types";
import { apiClient } from "../../../services/apiClient";
import {
  API_ENDPOINT_ADMIN_USERS,
  API_ENDPOINT_ANALYTICS_INSTRUCTOR_STUDENTS,
} from "../../../services/apiTypes";

interface ApiUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: User["role"];
  photoUrl?: string;
  status?: User["status"];
  createdAt?: string;
  joined?: string;
}

interface InstructorStudentsResponse {
  success: boolean;
  students: ApiUser[];
}

interface UpdateUserResponse {
  message: string;
  user: ApiUser;
}

function mapUser(user: ApiUser): User {
  return {
    id: user.id ?? user._id ?? "",
    name: user.name,
    email: user.email,
    role: user.role,
    photoUrl: user.photoUrl,
    status: user.status,
    joined: user.joined ?? user.createdAt,
  };
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<ApiUser[]>(API_ENDPOINT_ADMIN_USERS);
    return response.data.map(mapUser);
  },

  async getInstructorStudents(): Promise<User[]> {
    const response = await apiClient.get<InstructorStudentsResponse>(
      API_ENDPOINT_ANALYTICS_INSTRUCTOR_STUDENTS,
    );
    return response.data.students.map(mapUser);
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const response = await apiClient.put<UpdateUserResponse>(
      `${API_ENDPOINT_ADMIN_USERS}/${id}`,
      updates,
    );
    return mapUser(response.data.user);
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINT_ADMIN_USERS}/${id}`);
  },
};
