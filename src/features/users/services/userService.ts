import type { User } from "../../../types";
import { apiClient } from "../../../services/apiClient";
import {
  API_ENDPOINT_ADMIN_USERS,
  API_ENDPOINT_ANALYTICS_INSTRUCTOR_STUDENTS,
  API_ENDPOINT_INSTRUCTOR_USERS,
} from "../../../services/apiTypes";

interface ApiUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: User["role"];
  photoUrl?: string;
  status?: User["status"];
  description?: string;
  enrolledCourses?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  joined?: string;
  __v?: number;
}

interface InstructorStudentsResponse {
  success: boolean;
  students: ApiUser[];
}

interface UpdateUserResponse {
  message: string;
  user: ApiUser;
}

export type AdminUpdateUserPayload = Pick<
  User,
  "name" | "email" | "role" | "status"
>;

export type InstructorUpdateUserPayload = AdminUpdateUserPayload;

function mapUser(user: ApiUser): User {
  return {
    id: user.id ?? user._id ?? "",
    name: user.name,
    email: user.email,
    role: user.role,
    photoUrl: user.photoUrl,
    status: user.status,
    description: user.description,
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

  async updateUser(id: string, updates: AdminUpdateUserPayload): Promise<User> {
    const payload: AdminUpdateUserPayload = {
      name: updates.name,
      email: updates.email,
      role: updates.role,
      status: updates.status,
    };
    const response = await apiClient.put<UpdateUserResponse>(
      `${API_ENDPOINT_ADMIN_USERS}/${id}`,
      payload,
    );
    return mapUser(response.data.user);
  },

  async updateInstructorUser(
    id: string,
    updates: InstructorUpdateUserPayload,
  ): Promise<User> {
    const payload: InstructorUpdateUserPayload = {
      name: updates.name,
      email: updates.email,
      role: updates.role,
      status: updates.status,
    };
    const response = await apiClient.put<UpdateUserResponse>(
      `${API_ENDPOINT_INSTRUCTOR_USERS}/${id}`,
      payload,
    );
    return mapUser(response.data.user);
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINT_ADMIN_USERS}/${id}`);
  },
};
