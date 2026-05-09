import type { AxiosError } from "axios";
import type { UserRole } from "../../../types";
import { apiClient } from "../../../services/apiClient";
import {
  authTokenStorageKey,
  authUserStorageKey,
} from "../../../utils/constants";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  photoUrl?: string;
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

interface SignupResponse extends AuthUser {
  token: string;
  photoUrl: string;
  enrolledCourses: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
  message: string;
}

export interface LogoutResponse {
  message: string;
}

const pendingAuthRequests = new Map<string, Promise<unknown>>();

function userFromSignup(payload: SignupResponse): AuthUser {
  return {
    _id: payload._id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    photoUrl: payload.photoUrl,
  };
}

function saveToken(token: string | null) {
  if (token) {
    localStorage.setItem(authTokenStorageKey, token);
    return;
  }

  localStorage.removeItem(authTokenStorageKey);
}

function saveUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(authUserStorageKey, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(authUserStorageKey);
}

function getStoredToken() {
  return localStorage.getItem(authTokenStorageKey);
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
    const response = await apiClient.get<LogoutResponse>("/api/auth/logout");
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

export const authService = {
  async login(email: string, password: string) {
    const payload: LoginPayload = { email, password };
    const response = await authRequest<LoginResponse, LoginPayload>(
      "/api/auth/login",
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
      "/api/auth/signup",
      payload,
    );
    const user = userFromSignup(response);

    saveToken(response.token);
    saveUser(user);

    return {
      token: response.token,
      user,
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

  getToken() {
    return getStoredToken();
  },

  getUser() {
    return getStoredUser();
  },
};
