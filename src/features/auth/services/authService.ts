import type { AxiosError } from "axios";
import type { UserRole, UserStatus } from "../../../types";
import {
  apiClient,
  getAuthToken,
  setAuthToken,
} from "../../../services/apiClient";
import {
  API_ENDPOINT_AUTH_LOGIN,
  API_ENDPOINT_AUTH_LOGOUT,
  API_ENDPOINT_AUTH_SIGNUP,
  API_ENDPOINT_USER_GET_CURRENT,
  API_ENDPOINT_USER_UPDATE_PROFILE,
} from "../../../services/apiTypes";
import { authUserStorageKey } from "../../../utils/constants";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  description?: string;
  photoUrl?: string;
  enrolledCourses?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  description: string;
  photoUrl?: File | null;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
  token: string;
  user: AuthUser;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
  message: string;
}

type UpdateProfileResponse =
  | AuthUser
  | {
      data?: AuthUser;
      message?: string;
      user?: AuthUser;
    };

type CurrentUserResponse =
  | AuthUser
  | {
      data?: AuthUser;
      message?: string;
      user?: AuthUser;
    };

export interface LogoutResponse {
  message: string;
}

const pendingAuthRequests = new Map<string, Promise<unknown>>();

function saveToken(token: string | null) {
  setAuthToken(token);
}

function saveUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(authUserStorageKey, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(authUserStorageKey);
}

function getStoredToken() {
  return getAuthToken();
}

function getStoredUser() {
  const stored = localStorage.getItem(authUserStorageKey);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    localStorage.removeItem(authUserStorageKey);
    return null;
  }
}

async function authRequest<T, B>(path: string, body?: B) {
  const requestKey = `${path}:${body ? JSON.stringify(body) : ""}`;
  const pendingRequest = pendingAuthRequests.get(requestKey) as
    | Promise<T>
    | undefined;

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = apiClient
    .post<T>(path, body)
    .then((response) => response.data)
    .catch((error) => {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const message =
        axiosError.response?.data?.message ?? axiosError.response?.data?.error;
      throw new Error(message ?? "Authentication request failed.");
    })
    .finally(() => {
      pendingAuthRequests.delete(requestKey);
    });

  pendingAuthRequests.set(requestKey, request);
  return request;
}

async function logoutRequest() {
  try {
    const response = await apiClient.get<LogoutResponse>(
      API_ENDPOINT_AUTH_LOGOUT,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<
      { message?: string; error?: string } | string
    >;
    const responseData = axiosError.response?.data;
    const message =
      typeof responseData === "string"
        ? undefined
        : (responseData?.message ?? responseData?.error);

    throw new Error(
      message ??
        `Logout failed${axiosError.response?.status ? ` (${axiosError.response.status})` : ""}.`,
    );
  }
}

function buildProfileFormData(payload: UpdateProfilePayload) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("description", payload.description);

  if (payload.photoUrl) {
    formData.append("photoUrl", payload.photoUrl);
  }

  return formData;
}

function normalizeProfileResponse(response: UpdateProfileResponse) {
  if ("_id" in response) {
    return {
      user: response,
      message: "Profile updated successfully.",
    };
  }

  return {
    user: response.user ?? response.data,
    message: response.message ?? "Profile updated successfully.",
  };
}

function normalizeCurrentUserResponse(response: CurrentUserResponse) {
  if ("_id" in response) {
    return response;
  }

  return response.user ?? response.data;
}

export const authService = {
  async login(email: string, password: string) {
    const payload: LoginPayload = { email, password };
    const response = await authRequest<LoginResponse, LoginPayload>(
      API_ENDPOINT_AUTH_LOGIN,
      payload,
    );

    saveToken(response.token);
    saveUser(response.user);

    return {
      token: response.token,
      user: response.user,
      message: response.message,
    };
  },

  async signup(payload: SignupPayload) {
    const response = await authRequest<SignupResponse, SignupPayload>(
      API_ENDPOINT_AUTH_SIGNUP,
      payload,
    );

    saveToken(response.token);
    saveUser(response.user);

    return {
      token: response.token,
      user: response.user,
      message: response.message,
    };
  },

  async logout() {
    try {
      return await logoutRequest();
    } finally {
      saveToken(null);
      saveUser(null);
    }
  },

  async updateProfile(payload: UpdateProfilePayload) {
    try {
      const response = await apiClient.put<UpdateProfileResponse>(
        API_ENDPOINT_USER_UPDATE_PROFILE,
        buildProfileFormData(payload),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const result = normalizeProfileResponse(response.data);

      if (!result.user) {
        throw new Error("Profile update did not return a user.");
      }

      const currentUser = getStoredUser();
      const updatedUser = {
        ...currentUser,
        ...result.user,
      };

      saveUser(updatedUser);

      return {
        user: updatedUser,
        message: result.message,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const message =
        axiosError.response?.data?.message ?? axiosError.response?.data?.error;

      throw new Error(message ?? "Failed to update profile.");
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get<CurrentUserResponse>(
        API_ENDPOINT_USER_GET_CURRENT,
      );
      const user = normalizeCurrentUserResponse(response.data);

      if (!user) {
        throw new Error("Current user request did not return a user.");
      }

      saveUser(user);

      return user;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const message =
        axiosError.response?.data?.message ?? axiosError.response?.data?.error;

      throw new Error(message ?? "Failed to load current user.");
    }
  },

  getToken() {
    return getStoredToken();
  },

  getUser() {
    return getStoredUser();
  },
};
