import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { UserRole } from "../../../types";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  clearAuthMessage,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
  updateProfile,
} from "../store/authStore";
import type { UpdateProfilePayload } from "../services/authService";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isLoading, successMessage } = useSelector(
    (state: RootState) => state.auth,
  );
  const login = async (email: string, password: string) => {
    const result = await dispatch(loginUser({ email, password })).unwrap();
    return result.user;
  };
  const signup = async (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    const result = await dispatch(signupUser(payload)).unwrap();
    return result.user;
  };
  const logout = async () => {
    await dispatch(logoutUser());
  };
  const saveProfile = async (payload: UpdateProfilePayload) => {
    const result = await dispatch(updateProfile(payload)).unwrap();
    return result.user;
  };
  const refreshCurrentUser = useCallback(async () => {
    const result = await dispatch(fetchCurrentUser()).unwrap();
    return result;
  }, [dispatch]);
  const clearMessage = () => {
    dispatch(clearAuthMessage());
  };

  return {
    user,
    token,
    isLoading,
    successMessage,
    login,
    signup,
    logout,
    saveProfile,
    refreshCurrentUser,
    clearMessage,
  };
}
