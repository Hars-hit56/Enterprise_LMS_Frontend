import { useDispatch, useSelector } from "react-redux";
import type { UserRole } from "../../../types";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  clearAuthMessage,
  loginUser,
  logoutUser,
  signupUser,
} from "../store/authStore";

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
    clearMessage,
  };
}
